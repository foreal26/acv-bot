import Keyv from "@keyvhq/core";
import { Client, Message, MessageEmbed } from "discord.js"
import { resetClock, shouldReset } from "./helpers";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayOfYear from "dayjs/plugin/dayOfYear";
// import cache from "node-cache"
// import Sheets from "node-sheets"
import { PrismaClient, quotes } from '@prisma/client'

import { authors } from "./commonAuthors";
dayjs.extend(relativeTime)
dayjs.extend(dayOfYear)

const API_KEY = process.env["GOOGLE_API_KEY"];
const SHEET_ID = process.env["SHEET_ID"];

// const sheetCache = new cache();
const randomQueue: quotes[] = [];
const prisma = new PrismaClient()

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

// const getTable = async () => {
//     let table: GSheet = sheetCache.get('quotes')
//     if (!table) {
//         console.log("not in cache, fetching")
//         const gs = new Sheets(SHEET_ID);
//         await gs.authorizeApiKey(API_KEY);
//         table = await gs.tables("Responses!A:D");
//         sheetCache.set('quotes', table, 300);
//     }
//     return table;
// }

const getTable = async () => {
    return prisma.quotes.findMany();
}

// const embedFromRow = (row: Row) => {
//     const author = row.Author.stringValue.trim()
//     const quote = row.Quote.stringValue.trim()
//     let link = row.Link ? row.Link.stringValue.trim() : ""
//     if (!link.match(/^https?:\/\//)) {
//         link = "https://" + link
//     }
//     return new MessageEmbed()
//         .setTitle(author)
//         .setDescription(quote)
//         .setURL(link);
// }

const embedFromRow = (row: quotes) => {
    const { author, quote, link } = row;
    let embed = new MessageEmbed()
        .setTitle(author)
        .setDescription(quote)
    if (link) {
        return embed.setURL(link);
    } else {
        return embed;
    }

}

const maintainQueue = () => {
    if (randomQueue.length >= 5) {
        randomQueue.pop()
    }
}

// const getRandom = (items: Row[]): Row => {
//     const randIndex = Math.floor(Math.random() * items.length);
//     let row = items[randIndex];
//     if (randomQueue.some(q => q === row || q.author === row.author)) {
//         console.log("Found dupe, rerandomizing")
//         row = items[Math.floor(Math.random() * items.length)];
//     } else {
//         randomQueue.push(row)
//     }
//     maintainQueue()
//     return row
// }

const getRandom = (items: quotes[]): quotes => {
    const randIndex = Math.floor(Math.random() * items.length);
    let row = items[randIndex];
    if (randomQueue.some(q => q === row || q.author === row.author)) {
        console.log("Found dupe, rerandomizing")
        row = items[Math.floor(Math.random() * items.length)];
    } else {
        randomQueue.push(row)
    }
    maintainQueue()
    return row
}

const quote: Command = {
    condition: (message, client) => {
        const quoteMeBb = message.mentions.has(client.user) && message.content.includes("quote me bb")
        const partOfDay = message.content.includes("night") ||
            message.content.includes("day") ||
            message.content.includes("evening") ||
            message.content.includes("in here");
        const isRedDragon = message.author.id === "160158668422119424" && message.content.includes("quiet") && partOfDay;
        const isQuote = message.content === "!quote"
        return quoteMeBb || isRedDragon || isQuote;
    },
    action: async (message, db) => {
        const partOfDay = message.content.includes("night") ||
            message.content.includes("day") ||
            message.content.includes("evening") ||
            message.content.includes("in here");
        const isRedDragon = message.author.id === "160158668422119424" && message.content.includes("quiet") && partOfDay;
        if (isRedDragon) {
            message.channel.send("I got you bb. Have a quote! :heartforyou:")
        }

        if (message.author.id === "564623926425288704") {
            const lastRun = await db.get('ward');
            if (lastRun) {
                const asDate = dayjs(lastRun);
                if (asDate.dayOfYear() !== dayjs().dayOfYear()) {
                    message.channel.send("Hi bb. Love ya. Here's a totally not Sci-Fi/AI quote for ya.")
                }
            }
            await db.set('ward', dayjs().toJSON())
        }

        try {
            const table = await getTable();
            const row = getRandom(table);
            message.channel.send({ embeds: [embedFromRow(row)] });
        } catch (error) {
            console.log(error)
            message.reply("Sorry, but no.")
        }

    }
}

const uncommonQuote: Command = {
    condition: (message, client) => {
        const quoteMeBb = message.mentions.has(client.user) && message.content.includes("throw me a gem bb")
        return quoteMeBb;
    },
    action: async (message) => {
        try {
            const table = (await getTable()).filter(row => !authors.has(row.author.trim().toLowerCase()));
            const row = getRandom(table)
            message.channel.send({ embeds: [embedFromRow(row)] });
        } catch (error) {
            message.reply("Sorry, but no.")
        }
    }
}

const libQuote: Command = {
    condition: (message, client) => {
        const quoteMeBb = message.mentions.has(client.user) && message.content.includes("quote me boo")
        return quoteMeBb;
    },
    action: async (message) => {
        try {
            const table = (await getTable()).filter(row => {
                const cleaned = row.author.trim().toLowerCase()
                return cleaned
                    .includes("liberty1prime") || cleaned.includes("gomez3600")
            });
            const row = getRandom(table)
            message.channel.send({ embeds: [embedFromRow(row)] });
        } catch (error) {
            message.reply("Sorry, but no.")
        }
    }
}

const latest: Command = {
    condition: (message, client) => {
        const quoteMeBb = message.mentions.has(client.user) && /quote ([a-z-_ A-Z0-9]*) bb$/.test(message.content)
        return quoteMeBb;
    },
    action: async (message) => {
        try {
            const regexMatch = /quote ([a-z-_ A-Z0-9]*) bb$/.exec(message.content)
            if (regexMatch) {
                const table = await prisma.quotes.findMany({
                    where: {
                        author: {
                            contains: regexMatch[1]
                        }
                    }
                })
                const randIndex = Math.floor(Math.random() * table.length);
                const row = table[randIndex];
                message.channel.send({ embeds: [embedFromRow(row)] });
            }
        } catch (error) {
            console.log(error)
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
    libQuote,
    latest,
    help,
]
