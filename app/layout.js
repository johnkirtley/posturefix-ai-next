/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */

'use client';

import Head from 'next/head';
import { useState } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import PlausibleProvider from 'next-plausible';
import { AuthProvider, UserContext } from './Context';
// import { GoogleAnalytics } from './components/GoogleAnalytics';

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
                <title>Posture Fix | Tailored Posture Correction Workouts | App</title>
                <meta name="description" content="Posture Fix | Fix Your Posture With Tailored Workouts | App" key="desc" />
                <meta property="og:title" content="Posture Fix" />
                <meta
                    property="og:description"
                    content="Fix Your Posture With Tailored Workouts"
                />
                <meta
                    property="og:image"
                    content="/text-logo-2.png"
                />
                <meta name="theme-color" content="#000" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="PostureFix" />
                <meta name="mobile-web-app-capable" content="yes" />

                <link rel="apple-touch-icon" href="/icon-512x512.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icon-512x512.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icon-512x512.png" />
                <link rel="apple-touch-icon" sizes="167x167" href="/icon-512x512.png" />

                <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />

                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            {/* <GoogleAnalytics /> */}
            <body className={inter.className}>
                <div className=" min-h-screen" style={{ backgroundColor: 'rgb(115 56 0 / 5%)' }}>
                    <PlausibleProvider domain="app.posturefix.io" taggedEvents enabled trackLocalhost>
                        <AuthProvider>
                            <UserContext.Provider value={{ userInfo, setUserInfo }}>
                                {children}
                            </UserContext.Provider>
                        </AuthProvider>
                    </PlausibleProvider>
                </div>
            </body>
        </html>
    );
}
