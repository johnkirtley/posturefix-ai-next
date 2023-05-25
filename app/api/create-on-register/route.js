/* eslint-disable import/prefer-default-export */
// import { NextResponse } from 'next/server';
import Stripe from 'stripe';

let stripeKey;

if (process.env.NEXT_PUBLIC_ENV === 'prod') {
    stripeKey = process.env.NEXT_PUBLIC_STRIPE_SK_PROD;
} else {
    stripeKey = process.env.NEXT_PUBLIC_STRIPE_SK;
}

export async function POST(req) {
    const stripe = new Stripe(stripeKey);
    const { email } = await req.json();

    console.log('email', email);

    const customer = await stripe.customers.create({
        email,
        metadata: { usedFreeTrial: false },
    });

    const createdUser = { customer };

    return new Response(JSON.stringify(createdUser));
}
