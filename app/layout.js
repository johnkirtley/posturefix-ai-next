/* eslint-disable react/prop-types */

'use client';

import Head from 'next/head';
import { useState } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider, UserContext } from './Context';

const inter = Inter({ subsets: ['latin'] });

const defaultUserInfo = {
    email: '',
    name: '',
    painPoints: [],
    equipment: [],
    postureType: null,
    currentLevel: 1,
    currentProtocol: [],
    progressMade: {
        1: 0,
        2: 0,
        3: 0,
    },
};

export default function RootLayout({ children }) {
    const [userInfo, setUserInfo] = useState(defaultUserInfo);

    return (
        <html lang="en">
            <Head>
                <title>Posture Fix | Tailored Posture Correction Workouts</title>
                <meta name="description" content="Posture Fix | Fix Your Posture With Tailored Workouts" key="desc" />
                <meta property="og:title" content="Posture Fix" />
                <meta
                    property="og:description"
                    content="Fix Your Posture With Tailored Workouts"
                />
                <meta
                    property="og:image"
                    content="/text-logo-2.png"
                />
            </Head>
            <body className={inter.className}>
                <div className=" min-h-screen" style={{ backgroundColor: 'rgb(115 56 0 / 5%)' }}>
                    <AuthProvider>
                        <UserContext.Provider value={{ userInfo, setUserInfo }}>
                            {children}
                        </UserContext.Provider>
                    </AuthProvider>
                </div>
            </body>
        </html>
    );
}
