import { NextResponse } from 'next/server';

export async function GET() {
    return new NextResponse('{"license":true,"product":true,"ip":true,"expansions":"None"}', {
        headers: { 'Content-Type': 'application/json' }
    });
}
