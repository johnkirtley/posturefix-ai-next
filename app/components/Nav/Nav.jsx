/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { firebaseAuth } from '../../../firebase/clientApp';
import { useAuth } from '../../Context/AuthContext';
import { useFirebase } from '../../hooks/useFirebase';

export default function Nav() {
    const { user } = useAuth();
    const { userInfo } = useFirebase();
    const router = useRouter();

    const signOutButton = () => signOut(firebaseAuth)
        .then(() => {
            console.log('logged out');
            router.push('/');
        })
        .catch((error) => console.log(error));

    return (
        <div>
            {user
                ? (
                    <div>
                        <div className="navbar bg-neutral p-base pr-8 pl-8 mb-7 text-base-200">
                            <div className="navbar-start">
                                <div className="dropdown">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                                        <div className="flex gap-2 items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                                            <p>Menu</p>
                                        </div>
                                    </label>
                                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral rounded-box w-52">
                                        <li className="my-5">👋 Hey, {userInfo.name}</li>
                                        <li><Link href="/dashboard">Main Program</Link></li>
                                        <li><Link href="/exercise-library">Randomizer{userInfo && userInfo.currentLevel === 1 ? <span className="text-info text-xs">Unlocked After Level 1</span> : ''}</Link></li>
                                        <li><Link href="/rec-tools">Helpful Tools</Link></li>
                                        <li><Link href="/faq">FAQ</Link></li>
                                        <li><Link href="/account">Account</Link></li>
                                        <li><Link href="/help">Help</Link></li>
                                        <button type="button" onClick={signOutButton} className="btn btn-warning mt-20">Sign Out</button>
                                    </ul>
                                </div>
                            </div>
                            <div className="navbar-end">
                                <Image src="/logo.png" width={100} height={100} />
                            </div>
                        </div>
                    </div>
                ) : ''}
        </div>
    );
}
