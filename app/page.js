'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
    const router = useRouter();
    // const { user } = useAuth();

    // useEffect(() => {
    //     if (user) {
    //         router.push('/dashboard');
    //     }

    //     if (!user) {
    //         router.push('/');
    //     }
    // }, []);

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
                setLoggingIn(false);
                // posthog.capture('Manual Sign In Success', { user: user.email });
                router.push('/dashboard');
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

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="flex flex-col gap-20 z-10 w-80 items-center justify-center font-mono text-sm lg:flex">
                <div className="flex flex-col justify-center items-center card-bordered rounded-lg p-10 gap-10">
                    {showError ? <div className="alert-error">Error, Check Email and Password</div> : ''}
                    <div>
                        <p>Welcome Back</p>
                    </div>
                    <div>
                        <input name="username" value={credentials.username} onChange={handleChange} className="input input-bordered w-full my-2" placeholder="email" />
                        <input name="password" value={credentials.password} onChange={handleChange} className="input input-bordered w-full my-2" placeholder="password" type="password" />
                    </div>
                    <button type="submit" onClick={signIn} className="btn btn-primary">{loggingIn ? 'Logging In...' : 'Login'}</button>
                </div>
                <div className="text-center">
                    <p>Need an account? <Link href="/register" className="link">Register</Link></p>
                </div>
            </div>
        </main>
    );
}
