/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-alert */

'use client';

import { useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { usePlausible } from 'next-plausible';
import { firebaseAuth, firestore } from '../../firebase/clientApp';

const defaultCredentials = {
    username: '',
    password: '',
    confirmPass: '',
};

const errorsDefault = {
    emailExists: false,
    invalidEmail: false,
    invalidPass: false,
    passwordMismatch: false,
    generalError: false,
};

export default function Register() {
    const [credentials, setCredentials] = useState(defaultCredentials);
    const [errors, setErrors] = useState(errorsDefault);
    const [registerAccount, setRegisterAccount] = useState(false);
    const registerRef = useRef(null);
    const router = useRouter();
    const plausible = usePlausible();

    const auth = firebaseAuth;

    async function addToEmailOctopus(email) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_MICROSERVICE_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        return data;
    }

    async function createStripeSubscription(email) {
        const response = await fetch('/api/create-on-register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return console.error('Error:', response.statusText);
    }

    const signUp = async () => {
        setErrors(errorsDefault);
        const { username, password, confirmPass } = credentials;

        if (username.length < 1 || password.length < 1) {
            return;
        }

        if (password !== confirmPass) {
            setErrors({ ...errors, passwordMismatch: true });
            setTimeout(() => {
                setErrors(defaultCredentials);
            }, 1200);
            return;
        }

        if (password.length < 6) {
            setErrors({ ...errors, invalidPass: true });

            setTimeout(() => {
                setErrors(defaultCredentials);
            }, 1200);
            return;
        }

        setRegisterAccount(true);

        createUserWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                const { user } = userCredential;
                setErrors(errorsDefault);

                const usersRef = doc(collection(firestore, 'users'), user.email.toLowerCase());

                setDoc(usersRef, {
                    createdAt: serverTimestamp(),
                    email: `${user.email}`,
                    uid: `${user.uid}`,
                    showOnboarding: true,
                    name: '',
                    painPoints: [],
                    equipment: [],
                    painAfterInjury: null,
                    postureType: null,
                    activityLevel: null,
                    currentLevel: 1,
                    currentProtocol: [],
                    favorites: {
                        exercises: [],
                        routines: [],
                    },
                    progressMade: {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                    },
                });
                createStripeSubscription(user.email).then((res) => {
                    addToEmailOctopus(user.email);
                    // posthog.capture('Manual Sign Up', { user: user.email });
                    plausible('New User Register', { props: { email: user.email } });
                    router.push('/dashboard');
                    console.log(res);
                    setRegisterAccount(false);
                }).catch((err) => {
                    // posthog.capture('Manual Sign Up', { error: err });
                    console.log(err);
                });
            }).catch((error) => {
                const errorMessage = error.message;
                setRegisterAccount(false);

                if (errorMessage.includes('email-already-in-use')) {
                    setErrors({ ...errors, emailExists: true });

                    setTimeout(() => {
                        setErrors(defaultCredentials);
                    }, 1200);
                }

                if (errorMessage.includes('invalid-email')) {
                    setErrors({ ...errors, invalidEmail: true });
                    setTimeout(() => {
                        setErrors(defaultCredentials);
                    }, 1200);
                }
            });
    };

    const handleChange = useCallback((e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    }, [credentials]);

    const handleKeydown = (e) => {
        if (e.key === 'Enter') {
            registerRef.current.click();
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="flex flex-col gap-20 z-10 w-80 items-center justify-center text-sm lg:flex">
                <div className="flex flex-col justify-center items-center bg-secondary rounded-lg p-10 w-auto gap-5 shadow-2xl">
                    {errors.emailExists ? <p className="alert-error">Email already exists</p> : ''}
                    {errors.invalidEmail ? <p className="alert-error">Invalid email</p> : ''}
                    {errors.invalidPass ? <p className="alert-error">Invalid password. Must be at least 6 characters.</p> : ''}
                    {errors.passwordMismatch ? <p className="alert-error">Passwords do not match. Try again.</p> : ''}
                    {errors.generalError ? <p className="alert-error">This is embarassing. Error occurred. Please try again.</p> : ''}
                    <div>
                        <p className="font-semibold text-lg text-base-100">Let&apos;s Get Started</p>
                    </div>
                    <div>
                        <input name="username" value={credentials.username} onChange={handleChange} className="input input-bordered w-full my-2" placeholder="email" />
                        <input name="password" value={credentials.password} onChange={handleChange} className="input input-bordered w-full my-2" placeholder="password" type="password" />
                        <input name="confirmPass" value={credentials.confirmPass} onChange={handleChange} enterKeyHint="Register" onKeyDown={handleKeydown} className="input input-bordered w-full my-2" placeholder="confirm password" type="password" />
                    </div>
                    <div>
                        <p className="text-center text-base-100 text-xs">By registering, you agree to receive platform-related emails from us.
                        We&apos;ll never spam you.
                        </p>
                    </div>
                    <button ref={registerRef} type="submit" onClick={signUp} className="btn btn-info">{registerAccount ? 'Creating Account...' : 'Register'}</button>
                </div>
                <div className="text-center">
                    <p>Have an account? <Link href="/" className="link">Login</Link></p>
                </div>
            </div>
        </main>
    );
}
