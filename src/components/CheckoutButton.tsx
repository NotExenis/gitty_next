"use client";

import { useState } from "react";
import { FaShoppingCart, FaSpinner } from "react-icons/fa";

interface CheckoutButtonProps {
    productId: string;
    productName: string;
    price: number;
}

export default function CheckoutButton({ productId, productName, price }: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    productName,
                    price,
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Failed to create checkout session");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-white text-black font-bold h-14 rounded-xl hover:bg-zinc-200 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-white/5 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? (
                <FaSpinner className="animate-spin" />
            ) : (
                <FaShoppingCart className="group-hover:scale-110 transition-transform" />
            )}
            <span>{loading ? "Processing..." : "Buy Now"}</span>
        </button>
    );
}
