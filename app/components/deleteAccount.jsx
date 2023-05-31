'use client';

import { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteUser, signOut } from 'firebase/auth';
// import { usePostHog } from 'posthog-js/react';
import { useRouter } from 'next/navigation';
import { firestore, firebaseAuth } from '../../firebase/clientApp';

import { useAuth } from '../Context/AuthContext';

export default function DeleteAccount() {
    const [promptForCredentials, setPromptForCredentials] = useState(false);
    const { user } = useAuth();

    const router = useRouter();

    async function getCustomer(email) {
        const response = await fetch('/api/get-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        return data;
    }

    const deleteStripeUser = async (email) => {
        const customerData = await getCustomer(email);
        const customerId = customerData.data[0].id;

        console.log('delete customer', customerId);
        const response = await fetch('/api/delete-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerId }),
        });

        if (response.ok) {
            const data = await response.json();
            // posthog.capture('User Deleted Account', { email });
            return data;
        }

        return console.log('Error:', response.statusText);
    };

    const handleUserDelete = async () => {
        if (user) {
            const userRef = doc(firestore, 'users', user.email);
            const storeEmail = user.email;
            deleteDoc(userRef).then(() => {
                deleteUser(user).then(() => {
                    deleteStripeUser(storeEmail);
                })
                    .catch((error) => {
                        if (error.message.includes('auth/requires-recent-login')) {
                            console.log('error', error.message);

                            setPromptForCredentials(true);

                            // posthog.capture('Reauth Required For Account Delete',
                            // { email: storeEmail });
                            // setShowReAuthModal(true);
                            // setAccountDeleteModal(false);
                        }
                    });
            });
        }
    };

    const signOutButton = () => signOut(firebaseAuth)
        .then(() => {
            console.log('logged out');
            router.push('/');
        })
        .catch((error) => console.log(error));

    return (
        <div className="mt-20">
            <div>
                {promptForCredentials ? (
                    <div>
                        <button type="button" className="btn btn-neutral" onClick={signOutButton}>Sign Back In Before Making Account Changes</button>
                    </div>
                )
                    : (
                        <button type="button" className="btn btn-error" onClick={handleUserDelete}>
            Delete Account
                        </button>
                    )}
            </div>
        </div>
    );
}
