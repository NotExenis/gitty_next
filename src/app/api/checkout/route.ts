import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/app/private/session";

export async function POST(req: Request) {
    try {
        const { productId, productName, price } = await req.json();

        if (!productId || !price) {
            return NextResponse.json({ error: "Missing product details" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const session = cookieStore.get("session")?.value;
        const payload = session ? await decrypt(session) : null;

        if (!payload?.userId) {
            return NextResponse.json({ redirect: "/register" });
        }

        const baseUrl = "https://velocitydev.xyz";//process.env.NEXT_PUBLIC_APP_URL || "http://localhost:80";
        // Personal PayPal email needs to be provided in environment variables or replaced here
        const paypalEmail = "amaryt02@gmail.com";//process.env.PAYPAL_EMAIL || "your-paypal-email@example.com";

        // Generate PayPal Standard _xclick URL
        const params = new URLSearchParams({
            cmd: "_xclick",
            business: paypalEmail,
            item_name: productName || "Product",
            amount: price.toString(),
            currency_code: "USD",
            return: `${baseUrl}/dashboard?success=true&productId=${productId}`,
            cancel_return: `${baseUrl}/products/${productId}?canceled=true`,
            item_number: productId,
            no_shipping: "1", // Assuming it's a digital good based on the previous code
        });

        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;

        return NextResponse.json({ url: paypalUrl });
    } catch (error) {
        console.error("PayPal Checkout Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
