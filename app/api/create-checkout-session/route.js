/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

let stripeKey;

if (process.env.NEXT_PUBLIC_ENV === 'prod') {
    stripeKey = process.env.NEXT_PUBLIC_STRIPE_SK_PROD;
} else {
    stripeKey = process.env.NEXT_PUBLIC_STRIPE_SK;
}

export async function POST(req) {
    const stripe = new Stripe(stripeKey);
    const { successUrl, product, email } = await req.json();

    const customer = await stripe.customers.list({ email, limit: 1 });
    const checkForTrial = customer.data[0].metadata.usedFreeTrial;

    if (checkForTrial === 'true') {
        const session = await stripe.checkout.sessions.create({
            success_url: successUrl,
            cancel_url: successUrl,
            customer: customer.data[0].id,
            allow_promotion_codes: true,
            automatic_tax: { enabled: true },
            line_items: [
                { price: product, quantity: 1 },
            ],
            mode: 'subscription',
            customer_update: { address: 'auto' },
        });
        return NextResponse.json({ message: 'Checkout Created No Free Trial', session });
    }

    if (checkForTrial === 'false') {
        const session = await stripe.checkout.sessions.create({
            success_url: successUrl,
            cancel_url: successUrl,
            customer: customer.data[0].id,
            allow_promotion_codes: true,
            automatic_tax: { enabled: true },
            subscription_data: { trial_period_days: 7 },
            line_items: [
                { price: product, quantity: 1 },
            ],
            mode: 'subscription',
            customer_update: { address: 'auto' },
        });

        return new Response(JSON.stringify({ message: 'Checkout Created Free Trial', session }));
    }
}
