import { NextResponse } from "next/server";
import { connect } from "../../../../../private/connection";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function generateAccessToken() {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    const data = await response.json();
    return data.access_token;
}

const generateSegment = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let gen = "";
    for (let i = 0; i < 6; i++) gen += chars.charAt(Math.floor(Math.random() * chars.length));
    return gen;
};

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token"); // PayPal Order ID
        const productId = searchParams.get("productId");
        const userId = searchParams.get("userId");

        if (!token || !productId || !userId) {
            return NextResponse.redirect(new URL("/products?error=missing_params", req.url));
        }

        const accessToken = await generateAccessToken();

        // Capture payment for the order
        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${token}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const captureData = await response.json();

        if (captureData.status === "COMPLETED") {
            // Payment successful, generate product token and save to DB
            const productToken = `${generateSegment()}-${generateSegment()}-${generateSegment()}-${generateSegment()}`;

            const conn = await connect();
            await conn.execute(
                'INSERT INTO tbl_tokens (user_id, product_id, token, duration) VALUES (?, ?, ?, ?)',
                [userId, productId, productToken, "infinite"]
            );

            return NextResponse.redirect(new URL(`/dashboard?success=true&productId=${productId}`, req.url));
        } else {
            // Payment not completed
            console.error("PayPal Capture Error:", captureData);
            return NextResponse.redirect(new URL(`/products/${productId}?canceled=true&reason=incomplete`, req.url));
        }
    } catch (error) {
        console.error("PayPal Capture Route Error:", error);
        return NextResponse.redirect(new URL("/products?error=internal_server_error", req.url));
    }
}
