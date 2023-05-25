'use client';

import { useContext } from 'react';
import Nav from '../components/Nav/Nav';
import DeleteAccount from '../components/deleteAccount';
import { useAuth } from '../Context/AuthContext';
import { UserContext } from '../Context';

export default function Plans() {
    const { user } = useAuth();
    const { userInfo } = useContext(UserContext);

    async function createPortalSession(email) {
        let data;
        if (typeof window !== 'undefined') {
            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // eslint-disable-next-line no-undef
                body: JSON.stringify({ email, returnUrl: window.location.origin }),
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

    return (
        <div>
            {user ? (
                <div>
                    <Nav />
                    <h2 className="text-center">Account Page</h2>
                    <p>{userInfo.email}</p>
                    <DeleteAccount />
                    <button type="button" className="btn" onClick={() => generatePortal(user.email)}>Generate Portal</button>
                </div>
            ) : ''}
        </div>
    );
}
