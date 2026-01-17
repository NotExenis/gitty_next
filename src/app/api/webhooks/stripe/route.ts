import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { grantProduct } from "@/app/actions/admin.ts";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-12-15.clover",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
    const body = await req.text();
    const sig = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        if (!sig || !endpointSecret) {
            console.warn("Webhook signature checking failed: Missing secret or signature.");
            return NextResponse.json({ error: "Webhook Error: Missing secret or signature" }, { status: 400 });
        }
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;

            // Fulfill the purchase
            await fulfillOrder(session);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
    const productId = session.metadata?.productId;
    const customerEmail = session.customer_details?.email;

    if (!productId || !customerEmail) {
        console.error("Missing productId or email in session metadata");
        return;
    }

    console.log(`Fulfilling order for ${productId} to ${customerEmail}`);

    await grantProduct(customerEmail, productId);
}
