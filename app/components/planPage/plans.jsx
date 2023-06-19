/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/prefer-default-export */

'use client';

import { useState, useEffect } from 'react';
import { usePlausible } from 'next-plausible';
import { useAuth } from '../../Context/AuthContext';
import usePremiumStatus from '../../../stripe/usePremiumStatus';
import { generatePortal } from '../../../stripe/createPortal';
import { devPlanInfo, prodPlanInfo } from './planInfo';
import Nav from '../Nav/Nav';

export function PlanPage() {
    const [planClicked, setPlanClicked] = useState(false);
    const [showTrialText, setShowTrialText] = useState(false);
    const { user } = useAuth();
    const isUserPremium = usePremiumStatus(user && user.email);
    const [clicked, setClicked] = useState(false);
    const [loading, setLoading] = useState(false);

    const plausible = usePlausible();

    let plan;

    if (process.env.NEXT_PUBLIC_ENV === 'prod') {
        plan = prodPlanInfo;
    } else {
        plan = devPlanInfo;
    }

    async function getSubscriber(email) {
        const response = await fetch('/api/get-subscriber', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        return data;
    }

    async function getCustomer(email) {
        const response = await fetch('/api/get-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        const trial = data.data[0].metadata.usedFreeTrial !== 'true';

        setShowTrialText(trial);
        setLoading(false);
        return data;
    }

    async function createCheckoutSessions(product, email) {
        let data;
        if (typeof window !== 'undefined') {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // eslint-disable-next-line no-undef
                body: JSON.stringify({ product, successUrl: `${window.location.origin}/dashboard`, email }),
            });

            // posthog.capture('Checkout Session Created', { user: user.email });
            // logger('action', 'Checkout Session Created', { userId: user.uid });
            data = await response.json();
        }

        return data;
    }

    useEffect(() => {
        setLoading(true);
        if (user) {
            getSubscriber(user.email);
            getCustomer(user.email);
        }
    }, [user]);

    const handleBilling = (planType, idx) => {
        setPlanClicked({
            ...planClicked,
            [idx]: true,
        });

        if (isUserPremium.premiumStatus.planName === '') {
            createCheckoutSessions(planType, user.email).then((res) => {
                const { url } = res.session;
                plausible('New Checkout Session', { props: { email: user.email, plan: planType } });
                // eslint-disable-next-line no-undef
                window.location.assign(url);
            });
        } else {
            // posthog.capture('User Visited Stripe Portal', { user: user.email });
            // logger('action', 'User Visited Stripe Portal', { userId: user.uid });
            plausible('Billing Portal Generated', { props: { email: user.email } });
            generatePortal(user.email);
        }
    };

    const handleClick = () => {
        setClicked((prev) => !prev);
    };

    return (
        <div>
            <Nav />
            <div className="flex flex-col justify-center items-center gap-5">
                <p className="text-lg">Choose A Plan</p>
                <div className="form-control">
                    <label className="label cursor-pointer flex gap-4">
                        <span className="label-text font-bold">Monthly</span>
                        <input type="checkbox" className="toggle toggle-info" onChange={handleClick} checked={clicked} />
                        <span className="label-text font-bold">Yearly</span>
                    </label>
                </div>
                <div className="card w-11/12 m-auto rounded-md bg-base-100 shadow-xl">
                    <div className="card-body justify-center items-center gap-3 text-center">
                        <h2 className="card-title text-3xl">{!clicked ? plan[1].name : plan[0].name}</h2>
                        {showTrialText ? <p className="font-semibold">⏳ 7 day free trial available</p> : ''}
                        <p className="text-2xl font-bold">{!clicked ? `$${plan[1].price}` : `$${plan[0].price}`}{!clicked ? <span className="font-medium">/month</span> : <span className="font-medium">/year</span>}</p>
                        <p className="text-sm italic">{clicked ? <div><p className="border bg-warning w-full rounded-md p-1 text-xs">Save Over {plan[0].savings}%</p> <p>Compared To Monthly</p></div> : ''}</p>
                        <ul className="list-disc flex flex-col justify-start items-start gap-4">
                            {plan[0].features.map((feature) => (
                                <li className="text-left text-sm">{feature}</li>
                            ))}
                        </ul>
                        <p className="py-1 text-sm font-semibold">+ Access To All New Features</p>
                        <div className="card-actions justify-end">
                            {!loading ? <button disabled={loading} type="button" className="btn btn-info" onClick={!clicked ? () => handleBilling(plan[1].id) : () => handleBilling(plan[0].id)}>{planClicked ? 'Redirecting to Stripe' : 'Select'}</button>
                                : <button disabled={loading} type="button" className="btn btn-info btn-ghost">Loading Plan Info...</button> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
