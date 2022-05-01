import { Message } from "discord.js";

export function shouldReset(content: string) {
    return content.search(/(will not|shall not|do not|don't|shan't|won't) (forgive|forget).*(forgive|forget)/g) > 0
}

export interface KV {
    set: (key: string, value: any, ttl?: number) => void,
    get: (key: string) => any,
}

export async function resetClock(msg: Message, path: string, db: KV) {
    msg.reply('Resetting the clock!');
    msg.channel.send("https://c.tenor.com/m1vBPcWl69sAAAAM/reset-the-clock-pacific-rim.gif")
    await db.set(path, newResetDate())
    await db.set(`${path}-user`, msg.author.toString())
}

export function newResetDate() { return JSON.stringify(new Date()); }