/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-undef */

'use client';

import { useState, useRef } from 'react';
import { signInWithEmailAndPassword, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { firebaseAuth } from '../firebase/clientApp';

// import { useAuth } from './Context/AuthContext';

const auth = firebaseAuth;

const defaultCredentials = {
    username: '',
    password: '',
};

export default function Login() {
    const [credentials, setCredentials] = useState(defaultCredentials);
    const [showError, setShowError] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    const loginRef = useRef(null);
    const router = useRouter();

    const signIn = async () => {
        setShowError(false);
        const { username, password } = credentials;

        if (username.length < 1 || password.length < 1) {
            return;
        }

        setLoggingIn(true);

        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                console.log('userCredential', userCredential);
                // posthog.capture('Manual Sign In Success', { user: user.email });
                router.push('/dashboard');
                setLoggingIn(false);
            }).catch((error) => {
                const errorMessage = error.message;
                setLoggingIn(false);
                // posthog.capture('Manual Sign In Error', { error });
                if (errorMessage) {
                    setShowError(true);

                    setTimeout(() => {
                        setShowError(false);
                    }, 1200);
                }
            });
    };

    const handleChange = (event) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value,
        });
    };

    const handleKeydown = (e) => {
        if (e.key === 'Enter') {
            loginRef.current.click();
        }
    };

    const handleForgotPassword = () => {
        const btn = document.getElementById('my-modal-forgotPassword');
        btn.checked = true;
    };

    const handleForgotEmail = (e) => {
        setForgotEmail(e.target.value);
    };

    const submitPasswordReset = async () => {
        setSending(true);

        const firebaseAuthInstance = getAuth();

        try {
            await sendPasswordResetEmail(firebaseAuthInstance, forgotEmail);
            setEmailSent(true);
            setSending(false);
            console.log('Password reset email sent');
        } catch (error) {
            setSending(false);
            setEmailSent(false);
            console.error('Error sending password reset email:', error.message);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <input type="checkbox" id="my-modal-forgotPassword" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box flex flex-col justify-center items-center gap-5">
                        <h3 className="font-bold text-lg">Enter Email To Reset Password</h3>
                        {emailSent ? <p className="py-4">Email Sent! Please Check Your Inbox</p> : ''}
                        {emailSent ? '' : <input value={forgotEmail} onChange={handleForgotEmail} className="input py-4 input-bordered" placeholder="Enter Email..." />}
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={submitPasswordReset}>{sending ? 'Sending Email...' : 'Send Reset Email'}</button>
                            <label className="btn btn-ghost btn-outline" htmlFor="my-modal-forgotPassword">Close</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-20 z-10 w-80 items-center justify-center text-sm lg:flex">
                <div className="flex flex-col justify-center items-center card-bordered bg-primary rounded-lg p-10 gap-10 shadow-2xl">
                    {showError ? <div className="alert-error">Error, Check Email and Password</div> : ''}
                    <div>
                        <p className="font-semibold text-lg text-base-100">👋 Welcome Back</p>
                    </div>
                    <div>
                        <input name="username" value={credentials.username} onChange={handleChange} className="input input-bordered w-full my-2" placeholder="email" />
                        <input name="password" value={credentials.password} onKeyDown={handleKeydown} enterKeyHint="Login" onChange={handleChange} className="input input-bordered w-full my-2" placeholder="password" type="password" />
                    </div>
                    <div>
                        <button type="button" className="underline text-base-100" onClick={handleForgotPassword}>Forgot Password?</button>
                    </div>
                    <button ref={loginRef} type="submit" onClick={signIn} className="btn btn-info">{loggingIn ? 'Logging In...' : 'Login'}</button>
                </div>
                <div className="text-center">
                    <p>Need an account? <Link href="/register" className="link">Register</Link></p>
                </div>
            </div>
        </main>
    );
}
