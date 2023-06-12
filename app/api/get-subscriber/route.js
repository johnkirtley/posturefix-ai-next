/* eslint-disable import/prefer-default-export */
import Stripe from 'stripe';

let stripeKey;

if (process.env.NEXT_PUBLIC_ENV === 'prod') {
    stripeKey = process.env.NEXT_PUBLIC_STRIPE_SK_PROD;
} else {
    stripeKey = process.env.NEXT_PUBLIC_STRIPE_SK;
}

export async function POST(req) {
    const stripe = new Stripe(stripeKey);
    const data = await req.json();
    const { email } = data;
    const customer = await stripe.customers.list({ email });

    const sub = await stripe.subscriptions.list({ customer: customer.data[0].id, limit: 1 });

    if (sub) {
        return new Response(JSON.stringify(sub));
    }

    return new Response(JSON.stringify({ message: `No Subscription Found For ${email}` }));
}
