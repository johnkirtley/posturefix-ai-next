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
    const { email, returnUrl } = await req.json();

    const customer = await stripe.customers.list({ email });

    const session = await stripe.billingPortal.sessions.create({
        customer: customer.data[0].id,
        return_url: returnUrl,
    });
    const { url } = session;
    return new Response(JSON.stringify({ url }));
}
