/* eslint-disable import/prefer-default-export */

'use client';

import Script from 'next/script';

export function GoogleAnalytics() {
    return (
        <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA}`} />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
        window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA}');
        `}
            </Script>
        </>
    );
}
