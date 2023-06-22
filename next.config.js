/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
});

const nextConfig = withPWA({ images: { domains: ['i.imgur.com', 'posturepal.s3.us-east-2.amazonaws.com'] } });

module.exports = nextConfig;
