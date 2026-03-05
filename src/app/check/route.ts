import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import moment from 'moment';
import { connect } from '../../../private/connection';
import { EmbedBuilder } from 'discord.js';

function sha256(text: string) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const product = url.searchParams.get('product');

    if (!product || !token) {
        return NextResponse.json(null);
    }

    const ipAddress = req.headers.get('x-forwarded-for') || "unknown";
    const cleanIp = typeof ipAddress === 'string' ? ipAddress.replace('::ffff:', '') : ipAddress;

    let conn;
    try {
        conn = await connect();

        if (token === "free") {
            await sendAccepted(cleanIp, product, "Free User");
            return NextResponse.json({ user: "Free User" });
        }

        const hashedToken = sha256(token);

        let [rows]: any = await conn.execute(`SELECT * FROM tbl_tokens WHERE token = ? OR token = ?`, [hashedToken, token]);
        let tokens = rows as any[];

        if (tokens.length === 0) {
            await sendDenied(cleanIp, product);
            return NextResponse.json(null);
        }

        let foundToken = tokens[0];

        if (foundToken.duration !== 'infinite') {
            if (moment().isAfter(moment(foundToken.duration))) {
                await sendDenied(cleanIp, product);
                return NextResponse.json(null);
            }
        }

        let hashedIp = sha256(cleanIp);
        let accepted = false;

        if (product.toLowerCase() === 'cht') {
            accepted = true;
        } else if (!foundToken.ip || foundToken.ip === 'none') {
            await conn.execute(`UPDATE tbl_tokens SET ip = ? WHERE id = ?`, [hashedIp, foundToken.id]);
            accepted = true;
        } else if (foundToken.ip === hashedIp) {
            accepted = true;
        }

        if (accepted) {
            await sendAccepted(cleanIp, product, foundToken.user_id);
            return NextResponse.json({ user: foundToken.user_id });
        } else {
            await sendDenied(cleanIp, product);
            return NextResponse.json(null);
        }

    } catch (e) {
        console.error("Check route error:", e);
        await sendDenied(cleanIp, product);
        return NextResponse.json(null);
    } finally {
        if (conn) conn.end();
    }
}

async function sendAccepted(ipAddress: string, product: string, user: string) {
    if (!process.env.DISCORD_TOKEN) return;

    let memberText = user === "Free User" ? "Free User" : user;

    const embed = new EmbedBuilder()
        .setAuthor({ name: product })
        .setDescription(`:white_check_mark: **${ipAddress}** has been accepted for **${memberText}**`)
        .setColor("#9EF798")
        .setFooter({ text: `Authenticated | ${moment().format("LLL")}` });

    try {
        await fetch('https://discord.com/api/v10/channels/1145002159126098011/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ embeds: [embed.toJSON()] })
        });
    } catch (e) { }
}

async function sendDenied(ipAddress: string, product: string) {
    if (!process.env.DISCORD_TOKEN) return;

    const embed = new EmbedBuilder()
        .setAuthor({ name: product })
        .setDescription(`:x: **${ipAddress}** has been denied.`)
        .setColor("#F97E7E");

    try {
        await fetch('https://discord.com/api/v10/channels/1145002159126098011/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ embeds: [embed.toJSON()] })
        });
    } catch (e) { }
}
