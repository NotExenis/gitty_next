import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/app/private/session";

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

        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            return NextResponse.json({ error: "PayPal credentials not configured" }, { status: 500 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://velocitydev.xyz";
        const accessToken = await generateAccessToken();

        const orderPayload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: productId,
                    description: productName || "Product",
                    amount: {
                        currency_code: "USD",
                        value: price.toString(),
                    },
                },
            ],
            application_context: {
                return_url: `${baseUrl}/api/checkout/capture?productId=${productId}&userId=${payload.userId}`,
                cancel_url: `${baseUrl}/products/${productId}?canceled=true`,
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
            },
        };

        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(orderPayload),
        });

        const order = await response.json();

        if (order.id) {
            // Find the approve URL
            const approveLink = order.links.find((link: any) => link.rel === "approve");
            if (approveLink) {
                return NextResponse.json({ url: approveLink.href });
            }
        }

        console.error("PayPal Create Order Error:", order);
        return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 });
    } catch (error) {
        console.error("PayPal Checkout Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
