/* eslint-disable max-len */

'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '../components/Nav/Nav';
import DeleteAccount from '../components/deleteAccount';
import { useAuth } from '../Context/AuthContext';
import { UserContext } from '../Context';
import { Loading } from '../components/loading';
import usePremiumStatus from '../../stripe/usePremiumStatus';

export default function Plans() {
    const { user } = useAuth();
    const { userInfo } = useContext(UserContext);
    const { premiumStatus, loading } = usePremiumStatus(user.email);
    const router = useRouter();

    async function createPortalSession(email) {
        let data;
        if (typeof window !== 'undefined') {
            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // eslint-disable-next-line no-undef
                body: JSON.stringify({ email, returnUrl: `${window.location.origin}/dashboard` }),
            });

            data = await response.json();

            console.log('Success:', data.message);
        }

        return data;
    }

    const generatePortal = (email) => {
        if (typeof window !== 'undefined') {
            createPortalSession(email).then((res) => {
                const { url } = res;
                // eslint-disable-next-line no-undef
                window.location.assign(url);
            }).catch((err) => console.log(err));
        }
    };

    if (loading) {
        return <Loading text="Loading Account Info" />;
    }

    return (
        <div>
            {user ? (
                <div>
                    <Nav />
                    <div className="flex flex-col gap-5 justify-center items-center">
                        <h2 className="text-center font-bold mb-4">Account Page</h2>
                        <div className="flex flex-col justify-center items-center gap-2 border rounded-md p-5 w-3/4 m-auto bg-neutral text-info">
                            <div>
                                <p>Email: {userInfo.email}</p>
                            </div>
                            {/* <div>
                                <p className="underline text-base-100 hover:text-info">Change Password</p>
                            </div> */}
                        </div>
                        <div className="flex flex-col justify-center items-center border rounded-md w-3/4 p-5 m-auto bg-neutral text-info gap-5 mt-4">
                            <div><p className="font-bold">Subscription Information</p></div>
                            <div className="text-center">
                                <div>Current Plan: {premiumStatus && premiumStatus.planName !== '' ? premiumStatus.planName.toUpperCase() : 'No Active Plan'}</div>
                            </div>
                            <div>
                                {premiumStatus.planName !== '' ? <button type="button" className="btn btn-info" onClick={() => generatePortal(user.email)}>Manage Subscription</button> : ''}
                                {premiumStatus.planName === '' ? <button type="button" className="btn btn-info" onClick={() => router.push('/plans')}>Choose a Plan</button> : ''}
                            </div>
                        </div>
                        <DeleteAccount />
                    </div>
                </div>
            ) : ''}
        </div>
    );
}
