/* eslint-disable import/prefer-default-export */
import Stripe from 'stripe';

let stripeKey;

if (process.env.NEXT_PUBLIC_ENV === 'prod') {
    stripeKey = process.env.NEXT_PUBLIC_STRIPE_SK_PROD;
} else {
    stripeKey = process.env.NEXT_PUBLIC_STRIPE_SK;
}

// const stripe = require('stripe')(stripeKey);

export async function POST(req) {
    const stripe = new Stripe(stripeKey);
    const { customerId } = await req.json();

    const customer = await stripe.customers.del(`${customerId}`);

    return new Response(JSON.stringify(customer));
}
