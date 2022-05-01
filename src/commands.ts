import Keyv from "@keyvhq/core";
import { Client, Message, MessageEmbed } from "discord.js"
import { resetClock, shouldReset } from "./helpers";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import cache from "node-cache"
import Sheets from "node-sheets"
import { authors } from "./commonAuthors";
dayjs.extend(relativeTime)

const API_KEY = process.env["GOOGLE_API_KEY"];
const SHEET_ID = process.env["SHEET_ID"];

const sheetCache = new cache();
const randomQueue: Row[] = [];

type Command = {
    condition: (message: Message, client: Client) => boolean,
    action: (message: Message, db: Keyv) => Promise<void>
}

const isBot: Command = {
    condition: (message) => message.author.bot,
    action: async (_m, _db) => { }
};

const hasGuild: Command = {
    condition: (message) => !message.guild,
    action: async (_m, _db) => { }
}

const reset: Command = {
    condition: (message) => shouldReset(message.content),
    action: async (message, db) => { await resetClock(message, message.guild.id, db) }
}

const getTime: Command = {
    condition: (message, client) => message.content === "!time not forgotten" ||
        (
            message.mentions.has(client.user) && message.content.includes("time")
        ),
    action: async (message, db) => {
        const server = message.guild.id;
        const date = await db.get(server)
        const user = await db.get(`${server}-user`)
        const lastDate = dayjs(JSON.parse(date))
        if (user) {
            message.reply(`${user} invoked the eternal message of neither forgiving nor forgetting ` + lastDate.fromNow())
        } else {
            message.reply("We have neither forgiven nor forgotten in " + lastDate.fromNow(true))
        }
    }
}

const replyYes: Command = {
    condition: (message, client) => message.mentions.has(client.user) && message.content.includes("?"),
    action: async (message) => { message.reply("Yes.") }
}

const hestia: Command = {
    condition: (message) => message.content.toLowerCase().includes("hestia is bestia"),
    action: async (message) => { message.reply("https://giphy.com/gifs/hestia-bestia-whS3qTYrdCMj5cOXuq") }
}

const artemis: Command = {
    condition: (message) => message.content.toLowerCase().includes("no arty no party"),
    action: async (message) => { message.reply("https://tenor.com/view/artemis-love-liefde-godin-jacht-gif-20277855") }
}

const help: Command = {
    condition: (message, client) => message.mentions.has(client.user) && message.content.toLowerCase().includes("help"),
    action: async (message) => {
        message.reply(`Here's what I can do:
**I do not forgive, I do not forget**: Remark upon this solemn phrase and record it's use in history.

**@ACV-Clock time** or **!time not forgotten**: Remind you of the last recorded utterance of this legendary phrase.

**No arty no party**: Showcase artemis in all her splendor.

**Hestia is bestia**: Showcase hestia in all her splendor.

**@ACV-Clock quote me bb**: A randomly selected flowerpot quote

**@ACV-Clock throw me a gem bb**: A randomly selected flowerpot quote from a lesser known but no less great author`)
    }
}

type Row = {
    [id: string]: { value: string, stringValue: string };
}

type GSheet = {
    rows: Row[]
}

const getTable = async () => {
    let table: GSheet = sheetCache.get('quotes')
    if (!table) {
        console.log("not in cache, fetching")
        const gs = new Sheets(SHEET_ID);
        await gs.authorizeApiKey(API_KEY);
        table = await gs.tables("Responses!A:D");
        sheetCache.set('quotes', table, 300);
    }
    return table;
}

const embedFromRow = (row: Row) => {
    const author = row.Author.stringValue.trim()
    const quote = row.Quote.stringValue.trim()
    const link = row.Link ? row.Link.stringValue.trim() : ""
    return new MessageEmbed()
        .setTitle(author)
        .setDescription(quote)
        .setURL(link);
}

const maintainQueue = () => {
    if (randomQueue.length >= 5) {
        randomQueue.pop()
    }
}

const getRandom = (items: Row[]): Row => {
    const randIndex = Math.floor(Math.random() * items.length);
    let row = items[randIndex];
    if (randomQueue.some(q => q === row)) {
        row = items[randIndex];
    } else {
        randomQueue.push(row)
    }
    maintainQueue()
    return row
}

const quote: Command = {
    condition: (message, client) => {
        const quoteMeBb = message.mentions.has(client.user) && message.content.includes("quote me bb")
        const isRedDragon = message.author.id === "160158668422119424" && message.content.includes("quiet") && message.content.includes("night");
        const isQuote = message.content === "!quote"
        return quoteMeBb || isRedDragon || isQuote;
    },
    action: async (message) => {
        try {
            const table = await getTable();
            const row = getRandom(table.rows);
            message.channel.send({ embeds: [embedFromRow(row)] });
        } catch (error) {
            message.reply("Sorry, but no.")
        }
    }
}

const uncommonQuote: Command = {
    condition: (message, client) => {
        const quoteMeBb = message.mentions.has(client.user) && message.content.includes("throw me a gem bb")
        const isQuote = message.content === "!quote"
        return quoteMeBb || isQuote;
    },
    action: async (message) => {
        try {
            let table = await getTable();
            table = { rows: table.rows.filter(row => !authors.has(row.Author.stringValue.trim().toLowerCase())) };
            const row = getRandom(table.rows)
            message.channel.send({ embeds: [embedFromRow(row)] });
        } catch (error) {
            message.reply("Sorry, but no.")
        }
    }
}


export const commands: Command[] = [
    isBot,
    hasGuild,
    reset,
    getTime,
    replyYes,
    hestia,
    artemis,
    quote,
    uncommonQuote,
    help,
]
