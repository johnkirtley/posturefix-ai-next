/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
// import { usePostHog } from 'posthog-js/react';
import usePremiumStatus from '../../../stripe/usePremiumStatus';
import { useAuth } from '../../Context/AuthContext';
// import logger from '../../utils/logger';
import generatePortal from '../../../stripe/createPortal';

// import stripeIcon from '../../public/icons/stripe.png';

import { devPlanInfo, prodPlanInfo } from './planInfo';
// import styles from './plans.module.css';

export default function PlansPage() {
    // const [planClicked, setPlanClicked] = useState(false);
    // const [showTrialText, setShowTrialText] = useState(false);
    const { user } = useAuth();
    // const posthog = usePostHog();

    const isUserPremium = usePremiumStatus(user.email);

    let planInfo;

    if (process.env.NEXT_PUBLIC_ENV === 'prod') {
        planInfo = prodPlanInfo;
    } else {
        planInfo = devPlanInfo;
    }

    async function getSubscriber(email) {
        const response = await fetch('/api/get-subscriber', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        console.log('Customer:', data);
        return data;
    }

    async function getCustomer(email) {
        const response = await fetch('/api/get-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        const trial = data.customer.data[0].metadata.usedFreeTrial !== 'true';
        setShowTrialText(trial);
        return data;
    }

    async function createCheckoutSessions(product, email) {
        let data;
        if (typeof window !== 'undefined') {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product, successUrl: window.location.origin, email }),
            });

            // posthog.capture('Checkout Session Created', { user: user.email });
            // logger('action', 'Checkout Session Created', { userId: user.uid });
            data = await response.json();
        }

        return data;
    }

    useEffect(() => {
        getSubscriber(user.email);
        getCustomer(user.email);
    }, [user]);

    const handleBilling = (planType) => {
        setPlanClicked(true);

        if (isUserPremium.planName === '') {
            createCheckoutSessions(planType, user.email).then((res) => {
                const { url } = res.session;
                window.location.assign(url);
            });
        } else {
            // posthog.capture('User Visited Stripe Portal', { user: user.email });
            // logger('action', 'User Visited Stripe Portal', { userId: user.uid });
            generatePortal(user.email);
        }
    };

    return (
        <div>
            <Link href="/">
                <div className={styles.goHome}>
                    <p>Go Home</p>
                </div>
            </Link>
            <div className={styles.planGrid}>
                <div>
                Plan Page
                </div>
                <p>{planInfo}</p>
                <button type="button" onClick={handleBilling}>Billing</button>
            </div>
        </div>
    );
}
