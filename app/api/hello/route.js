/* eslint-disable import/prefer-default-export */

import { NextResponse } from 'next/server';

export function GET() {
    const data = { message: 'Hello, API!' };

    return NextResponse.json(data);
}
