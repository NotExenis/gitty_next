import { NextResponse } from 'next/server';

export async function GET() {
    return new NextResponse('{"license":true,"product":true,"ip":false,"expansions":"factionstop:fkore_stacker:skore_stacker:discordftop"}', {
        headers: { 'Content-Type': 'application/json' }
    });
}
