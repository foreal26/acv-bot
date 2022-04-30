import { Client, Intents } from 'discord.js';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from "dayjs";
import Keyv from "@keyvhq/core";
import KeyvSQLite from "@keyvhq/sqlite";
import { commands } from './commands';


const token = "ODQ2NzYwMDA3MjgxMjc4OTk2.YK0MtQ.BwFGTTwMPqYE9F16XP7VUJsngtw"
dayjs.extend(relativeTime)

const db = new Keyv({ store: new KeyvSQLite("sqlite://./database.sqlite") })

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})



client.on('debug', console.log);

client.once('ready', () => {
    console.log(`${client.user.tag} is ready`)
})

client.on('messageCreate', async (msg) => {
    for (const command of commands) {
        const { condition, action } = command;
        if (condition(msg, client)) {
            await action(msg, db);
            break;
        }
    }
});

client.login(token);