/* eslint-disable import/prefer-default-export */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import usePremiumStatus from '../../../stripe/usePremiumStatus';
import { generatePortal } from '../../../stripe/createPortal';
import { devPlanInfo } from './planInfo';

export function PlanPage() {
    const [planClicked, setPlanClicked] = useState({
        0: false,
        1: false,
        2: false,
    });
    const [showTrialText, setShowTrialText] = useState(false);
    const { user } = useAuth();
    const isUserPremium = usePremiumStatus(user.email);

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
        console.log('line 38 works', data);

        const trial = data.data[0].metadata.usedFreeTrial !== 'true';

        setShowTrialText(trial);
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
            console.log('plan type', planType);
            console.log('email', user.email);
            createCheckoutSessions(planType, user.email).then((res) => {
                const { url } = res.session;
                // eslint-disable-next-line no-undef
                window.location.assign(url);
            });
        } else {
            // posthog.capture('User Visited Stripe Portal', { user: user.email });
            // logger('action', 'User Visited Stripe Portal', { userId: user.uid });
            generatePortal(user.email);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-10 py-5">
            {devPlanInfo.map((plan, idx) => (
                <div className="card w-3/4 m-auto bg-base-100 shadow-xl" key={idx}>
                    <div className="card-body justify-center items-center gap-5 text-center">
                        <h2 className="card-title">{plan.type}</h2>
                        {showTrialText ? <p>3 day free trial available</p> : ''}
                        <p className="text-2xl font-bold">${plan.price}</p>
                        <p className="text-xs italic">{plan.savings > 0 ? <p><span className="border bg-warning w-full">Save Over {plan.savings}% </span><br /> Compared To Monthly</p> : ''}</p>
                        <p>If a dog chews shoes whose shoes does he choose?</p>
                        <div className="card-actions justify-end">
                            <button type="button" className="btn btn-primary" onClick={() => handleBilling(plan.id, idx)}>{planClicked[idx] ? 'Redirecting to Stripe' : 'Select'}</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
