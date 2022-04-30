import {Client as $hgUW1$Client, Intents as $hgUW1$Intents, MessageEmbed as $hgUW1$MessageEmbed} from "discord.js";
import $hgUW1$dayjspluginrelativeTime from "dayjs/plugin/relativeTime";
import $hgUW1$dayjs from "dayjs";
import $hgUW1$keyvhqcore from "@keyvhq/core";
import $hgUW1$keyvhqsqlite from "@keyvhq/sqlite";
import $hgUW1$nodesheets from "node-sheets";
import $hgUW1$nodecache from "node-cache";







function $e2e1ea6dd3b7d2e1$export$5de218b9ce36f19(content) {
    return content.search(/(will not|shall not|do not|don't|shan't|won't) (forgive|forget).*(forgive|forget)/g) > 0;
}
async function $e2e1ea6dd3b7d2e1$export$a647916c8bd30448(msg, path, db) {
    msg.reply('Resetting the clock!');
    msg.channel.send("https://c.tenor.com/m1vBPcWl69sAAAAM/reset-the-clock-pacific-rim.gif");
    await db.set(path, $e2e1ea6dd3b7d2e1$export$4425ccaab8f1491a());
    await db.set(`${path}-user`, msg.author.toString());
}
function $e2e1ea6dd3b7d2e1$export$4425ccaab8f1491a() {
    return JSON.stringify(new Date());
}






const $36741c77068e1fae$export$545bf518be75e25a = new Set([
    "darknessenthroned",
    "davidtheathenai",
    "ajjaxx",
    "theblack'sresurgence",
    "durararaaa",
    "liberty1prime",
    "djkopper",
    "sophprosyne",
    "charlennette",
    "e.c. scrubb",
    "aci100",
    "arms of atlas",
    "sal-tal",
    "ward", 
]);


$hgUW1$dayjs.extend($hgUW1$dayjspluginrelativeTime);
const $f5fb98c49704ea09$var$API_KEY = "AIzaSyBKt893Fw-Vnjf0XUHOUUbn2cYCZQCzSGw";
const $f5fb98c49704ea09$var$SHEET_ID = "19kYjaaPG8zBLbZR6TzSPtLPxnl2IjRCkVFXKPT1WiFA";
const $f5fb98c49704ea09$var$sheetCache = new $hgUW1$nodecache();
const $f5fb98c49704ea09$var$isBot = {
    condition: (message)=>message.author.bot
    ,
    action: async (_m, _db)=>{}
};
const $f5fb98c49704ea09$var$hasGuild = {
    condition: (message)=>!message.guild
    ,
    action: async (_m, _db)=>{}
};
const $f5fb98c49704ea09$var$reset = {
    condition: (message)=>$e2e1ea6dd3b7d2e1$export$5de218b9ce36f19(message.content)
    ,
    action: async (message, db)=>{
        await $e2e1ea6dd3b7d2e1$export$a647916c8bd30448(message, message.guild.id, db);
    }
};
const $f5fb98c49704ea09$var$getTime = {
    condition: (message, client)=>message.content === "!time not forgotten" || message.mentions.has(client.user) && message.content.includes("time")
    ,
    action: async (message, db)=>{
        const server = message.guild.id;
        const date = await db.get(server);
        const user = await db.get(`${server}-user`);
        const lastDate = $hgUW1$dayjs(JSON.parse(date));
        if (user) message.reply(`${user} invoked the eternal message of neither forgiving nor forgetting ` + lastDate.fromNow());
        else message.reply("We have neither forgiven nor forgotten in " + lastDate.fromNow(true));
    }
};
const $f5fb98c49704ea09$var$replyYes = {
    condition: (message, client)=>message.mentions.has(client.user) && message.content.includes("?")
    ,
    action: async (message)=>{
        message.reply("Yes.");
    }
};
const $f5fb98c49704ea09$var$hestia = {
    condition: (message)=>message.content.toLowerCase().includes("hestia is bestia")
    ,
    action: async (message)=>{
        message.reply("https://giphy.com/gifs/hestia-bestia-whS3qTYrdCMj5cOXuq");
    }
};
const $f5fb98c49704ea09$var$artemis = {
    condition: (message)=>message.content.toLowerCase().includes("no arty no party")
    ,
    action: async (message)=>{
        message.reply("https://tenor.com/view/artemis-love-liefde-godin-jacht-gif-20277855");
    }
};
const $f5fb98c49704ea09$var$help = {
    condition: (message, client)=>message.mentions.has(client.user) && message.content.toLowerCase().includes("help")
    ,
    action: async (message)=>{
        message.reply(`Here's what I can do:
**I do not forgive, I do not forget**: Remark upon this solemn phrase and record it's use in history.

**@ACV-Clock time** or **!time not forgotten**: Remind you of the last recorded utterance of this legendary phrase.

**No arty no party**: Showcase artemis in all her splendor.

**Hestia is bestia**: Showcase hestia in all her splendor.

**@ACV-Clock quote me bb**: A randomly selected flowerpot quote

**@ACV-Clock throw me a gem bb**: A randomly selected flowerpot quote from a lesser known but no less great author`);
    }
};
const $f5fb98c49704ea09$var$getTable = async ()=>{
    let table = $f5fb98c49704ea09$var$sheetCache.get('quotes');
    if (!table) {
        console.log("not in cache, fetching");
        const gs = new $hgUW1$nodesheets($f5fb98c49704ea09$var$SHEET_ID);
        await gs.authorizeApiKey($f5fb98c49704ea09$var$API_KEY);
        table = await gs.tables("Responses!A:D");
        $f5fb98c49704ea09$var$sheetCache.set('quotes', table, 300);
    }
    return table;
};
const $f5fb98c49704ea09$var$embedFromRow = (row)=>{
    const author = row.Author.stringValue.trim();
    const quote = row.Quote.stringValue.trim();
    const link = row.Link ? row.Link.stringValue.trim() : "";
    return new $hgUW1$MessageEmbed().setTitle(author).setDescription(quote).setURL(link);
};
const $f5fb98c49704ea09$var$quote = {
    condition: (message, client)=>{
        const quoteMeBb = message.mentions.has(client.user) && message.content.includes("quote me bb");
        const isRedDragon = message.author.id === "160158668422119424" && message.content.includes("quiet") && message.content.includes("night");
        const isQuote = message.content === "!quote";
        return quoteMeBb || isRedDragon || isQuote;
    },
    action: async (message)=>{
        try {
            const table = await $f5fb98c49704ea09$var$getTable();
            const randIndex = Math.floor(Math.random() * table.rows.length);
            const row = table.rows[randIndex];
            message.channel.send({
                embeds: [
                    $f5fb98c49704ea09$var$embedFromRow(row)
                ]
            });
        } catch (error) {
            message.reply("Sorry, but no.");
        }
    }
};
const $f5fb98c49704ea09$var$uncommonQuote = {
    condition: (message, client)=>{
        const quoteMeBb = message.mentions.has(client.user) && message.content.includes("throw me a gem bb");
        const isQuote = message.content === "!quote";
        return quoteMeBb || isQuote;
    },
    action: async (message)=>{
        try {
            let table = await $f5fb98c49704ea09$var$getTable();
            table = {
                rows: table.rows.filter((row)=>!$36741c77068e1fae$export$545bf518be75e25a.has(row.Author.stringValue.trim().toLowerCase())
                )
            };
            const randIndex = Math.floor(Math.random() * table.rows.length);
            const row1 = table.rows[randIndex];
            message.channel.send({
                embeds: [
                    $f5fb98c49704ea09$var$embedFromRow(row1)
                ]
            });
        } catch (error) {
            message.reply("Sorry, but no.");
        }
    }
};
const $f5fb98c49704ea09$var$ajaxFuckQuote = {
    condition: (message)=>message.author.id === "202338054143213568" && message.content.toLowerCase().includes("fuck")
    ,
    action: async (message)=>{
        try {
            let table = await $f5fb98c49704ea09$var$getTable();
            table = {
                rows: table.rows.filter((row)=>row.Author.stringValue.trim().toLowerCase() === "ajjaxx"
                )
            };
            const randIndex = Math.floor(Math.random() * table.rows.length);
            const row3 = table.rows[randIndex];
            message.channel.send({
                embeds: [
                    $f5fb98c49704ea09$var$embedFromRow(row3)
                ]
            });
        } catch (error) {
            message.reply("Sorry, but no.");
        }
    }
};
const $f5fb98c49704ea09$export$2ccc4f72dd956183 = [
    $f5fb98c49704ea09$var$isBot,
    $f5fb98c49704ea09$var$hasGuild,
    $f5fb98c49704ea09$var$reset,
    $f5fb98c49704ea09$var$getTime,
    $f5fb98c49704ea09$var$replyYes,
    $f5fb98c49704ea09$var$hestia,
    $f5fb98c49704ea09$var$artemis,
    $f5fb98c49704ea09$var$quote,
    $f5fb98c49704ea09$var$uncommonQuote,
    $f5fb98c49704ea09$var$ajaxFuckQuote,
    $f5fb98c49704ea09$var$help, 
];


const $149c1bd638913645$var$token = "ODQ2NzYwMDA3MjgxMjc4OTk2.YK0MtQ.gEZObWGMDeY0RUlnlBqH4kletSA";
$hgUW1$dayjs.extend($hgUW1$dayjspluginrelativeTime);
const $149c1bd638913645$var$db = new $hgUW1$keyvhqcore({
    store: new $hgUW1$keyvhqsqlite("sqlite://./database.sqlite")
});
const $149c1bd638913645$var$client = new $hgUW1$Client({
    intents: [
        $hgUW1$Intents.FLAGS.GUILDS,
        $hgUW1$Intents.FLAGS.GUILD_MESSAGES
    ]
});
$149c1bd638913645$var$client.on('debug', console.log);
$149c1bd638913645$var$client.once('ready', ()=>{
    console.log(`${$149c1bd638913645$var$client.user.tag} is ready`);
});
$149c1bd638913645$var$client.on('messageCreate', async (msg)=>{
    for (const command of $f5fb98c49704ea09$export$2ccc4f72dd956183){
        const { condition: condition , action: action  } = command;
        if (condition(msg, $149c1bd638913645$var$client)) {
            await action(msg, $149c1bd638913645$var$db);
            break;
        }
    }
});
$149c1bd638913645$var$client.login($149c1bd638913645$var$token);


//# sourceMappingURL=module.js.map
