var $8zHUo$discordjs = require("discord.js");
var $8zHUo$dayjspluginrelativeTime = require("dayjs/plugin/relativeTime");
var $8zHUo$dayjs = require("dayjs");
var $8zHUo$keyvhqcore = require("@keyvhq/core");
var $8zHUo$keyvhqsqlite = require("@keyvhq/sqlite");
var $8zHUo$nodesheets = require("node-sheets");
var $8zHUo$nodecache = require("node-cache");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}






function $dfecd32049fa58e9$export$5de218b9ce36f19(content) {
    return content.search(/(will not|shall not|do not|don't|shan't|won't) (forgive|forget).*(forgive|forget)/g) > 0;
}
async function $dfecd32049fa58e9$export$a647916c8bd30448(msg, path, db) {
    msg.reply('Resetting the clock!');
    msg.channel.send("https://c.tenor.com/m1vBPcWl69sAAAAM/reset-the-clock-pacific-rim.gif");
    await db.set(path, $dfecd32049fa58e9$export$4425ccaab8f1491a());
    await db.set(`${path}-user`, msg.author.toString());
}
function $dfecd32049fa58e9$export$4425ccaab8f1491a() {
    return JSON.stringify(new Date());
}






const $6099fd90fafeb558$export$545bf518be75e25a = new Set([
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


($parcel$interopDefault($8zHUo$dayjs)).extend(($parcel$interopDefault($8zHUo$dayjspluginrelativeTime)));
const $bd0f1b2466eebd0a$var$API_KEY = "AIzaSyC_dK5zo2zzip1Fd5jl1zS80B5V4fV1lmo";
const $bd0f1b2466eebd0a$var$SHEET_ID = "19kYjaaPG8zBLbZR6TzSPtLPxnl2IjRCkVFXKPT1WiFA";
const $bd0f1b2466eebd0a$var$sheetCache = new ($parcel$interopDefault($8zHUo$nodecache))();
const $bd0f1b2466eebd0a$var$randomQueue = [];
const $bd0f1b2466eebd0a$var$isBot = {
    condition: (message)=>message.author.bot
    ,
    action: async (_m, _db)=>{}
};
const $bd0f1b2466eebd0a$var$hasGuild = {
    condition: (message)=>!message.guild
    ,
    action: async (_m, _db)=>{}
};
const $bd0f1b2466eebd0a$var$reset = {
    condition: (message)=>$dfecd32049fa58e9$export$5de218b9ce36f19(message.content)
    ,
    action: async (message, db)=>{
        await $dfecd32049fa58e9$export$a647916c8bd30448(message, message.guild.id, db);
    }
};
const $bd0f1b2466eebd0a$var$getTime = {
    condition: (message, client)=>message.content === "!time not forgotten" || message.mentions.has(client.user) && message.content.includes("time")
    ,
    action: async (message, db)=>{
        const server = message.guild.id;
        const date = await db.get(server);
        const user = await db.get(`${server}-user`);
        const lastDate = ($parcel$interopDefault($8zHUo$dayjs))(JSON.parse(date));
        if (user) message.reply(`${user} invoked the eternal message of neither forgiving nor forgetting ` + lastDate.fromNow());
        else message.reply("We have neither forgiven nor forgotten in " + lastDate.fromNow(true));
    }
};
const $bd0f1b2466eebd0a$var$replyYes = {
    condition: (message, client)=>message.mentions.has(client.user) && message.content.includes("?")
    ,
    action: async (message)=>{
        message.reply("Yes.");
    }
};
const $bd0f1b2466eebd0a$var$hestia = {
    condition: (message)=>message.content.toLowerCase().includes("hestia is bestia")
    ,
    action: async (message)=>{
        message.reply("https://giphy.com/gifs/hestia-bestia-whS3qTYrdCMj5cOXuq");
    }
};
const $bd0f1b2466eebd0a$var$artemis = {
    condition: (message)=>message.content.toLowerCase().includes("no arty no party")
    ,
    action: async (message)=>{
        message.reply("https://tenor.com/view/artemis-love-liefde-godin-jacht-gif-20277855");
    }
};
const $bd0f1b2466eebd0a$var$help = {
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
const $bd0f1b2466eebd0a$var$getTable = async ()=>{
    let table = $bd0f1b2466eebd0a$var$sheetCache.get('quotes');
    if (!table) {
        console.log("not in cache, fetching");
        const gs = new ($parcel$interopDefault($8zHUo$nodesheets))($bd0f1b2466eebd0a$var$SHEET_ID);
        await gs.authorizeApiKey($bd0f1b2466eebd0a$var$API_KEY);
        table = await gs.tables("Responses!A:D");
        $bd0f1b2466eebd0a$var$sheetCache.set('quotes', table, 300);
    }
    return table;
};
const $bd0f1b2466eebd0a$var$embedFromRow = (row)=>{
    const author = row.Author.stringValue.trim();
    const quote = row.Quote.stringValue.trim();
    const link = row.Link ? row.Link.stringValue.trim() : "";
    return new $8zHUo$discordjs.MessageEmbed().setTitle(author).setDescription(quote).setURL(link);
};
const $bd0f1b2466eebd0a$var$maintainQueue = ()=>{
    if ($bd0f1b2466eebd0a$var$randomQueue.length >= 5) $bd0f1b2466eebd0a$var$randomQueue.pop();
};
const $bd0f1b2466eebd0a$var$getRandom = (items)=>{
    const randIndex = Math.floor(Math.random() * items.length);
    let row = items[randIndex];
    if ($bd0f1b2466eebd0a$var$randomQueue.some((q)=>q === row
    )) row = items[randIndex];
    else $bd0f1b2466eebd0a$var$randomQueue.push(row);
    $bd0f1b2466eebd0a$var$maintainQueue();
    return row;
};
const $bd0f1b2466eebd0a$var$quote = {
    condition: (message, client)=>{
        const quoteMeBb = message.mentions.has(client.user) && message.content.includes("quote me bb");
        const isRedDragon = message.author.id === "160158668422119424" && message.content.includes("quiet") && message.content.includes("night");
        const isQuote = message.content === "!quote";
        return quoteMeBb || isRedDragon || isQuote;
    },
    action: async (message)=>{
        try {
            const table = await $bd0f1b2466eebd0a$var$getTable();
            const row = $bd0f1b2466eebd0a$var$getRandom(table.rows);
            message.channel.send({
                embeds: [
                    $bd0f1b2466eebd0a$var$embedFromRow(row)
                ]
            });
        } catch (error) {
            message.reply("Sorry, but no.");
        }
    }
};
const $bd0f1b2466eebd0a$var$uncommonQuote = {
    condition: (message, client)=>{
        const quoteMeBb = message.mentions.has(client.user) && message.content.includes("throw me a gem bb");
        const isQuote = message.content === "!quote";
        return quoteMeBb || isQuote;
    },
    action: async (message)=>{
        try {
            let table = await $bd0f1b2466eebd0a$var$getTable();
            table = {
                rows: table.rows.filter((row)=>!$6099fd90fafeb558$export$545bf518be75e25a.has(row.Author.stringValue.trim().toLowerCase())
                )
            };
            const row1 = $bd0f1b2466eebd0a$var$getRandom(table.rows);
            message.channel.send({
                embeds: [
                    $bd0f1b2466eebd0a$var$embedFromRow(row1)
                ]
            });
        } catch (error) {
            message.reply("Sorry, but no.");
        }
    }
};
const $bd0f1b2466eebd0a$export$2ccc4f72dd956183 = [
    $bd0f1b2466eebd0a$var$isBot,
    $bd0f1b2466eebd0a$var$hasGuild,
    $bd0f1b2466eebd0a$var$reset,
    $bd0f1b2466eebd0a$var$getTime,
    $bd0f1b2466eebd0a$var$replyYes,
    $bd0f1b2466eebd0a$var$hestia,
    $bd0f1b2466eebd0a$var$artemis,
    $bd0f1b2466eebd0a$var$quote,
    $bd0f1b2466eebd0a$var$uncommonQuote,
    $bd0f1b2466eebd0a$var$help, 
];


const $882b6d93070905b3$var$token = "ODQ2NzYwMDA3MjgxMjc4OTk2.YK0MtQ.bG8C2yCa7arA2FD1iLnhKYhp1Ek";
($parcel$interopDefault($8zHUo$dayjs)).extend(($parcel$interopDefault($8zHUo$dayjspluginrelativeTime)));
const $882b6d93070905b3$var$db = new ($parcel$interopDefault($8zHUo$keyvhqcore))({
    store: new ($parcel$interopDefault($8zHUo$keyvhqsqlite))("sqlite://./database.sqlite")
});
const $882b6d93070905b3$var$client = new $8zHUo$discordjs.Client({
    intents: [
        $8zHUo$discordjs.Intents.FLAGS.GUILDS,
        $8zHUo$discordjs.Intents.FLAGS.GUILD_MESSAGES
    ]
});
$882b6d93070905b3$var$client.on('debug', console.log);
$882b6d93070905b3$var$client.once('ready', ()=>{
    console.log(`${$882b6d93070905b3$var$client.user.tag} is ready`);
});
$882b6d93070905b3$var$client.on('messageCreate', async (msg)=>{
    for (const command of $bd0f1b2466eebd0a$export$2ccc4f72dd956183){
        const { condition: condition , action: action  } = command;
        if (condition(msg, $882b6d93070905b3$var$client)) {
            await action(msg, $882b6d93070905b3$var$db);
            break;
        }
    }
});
$882b6d93070905b3$var$client.login($882b6d93070905b3$var$token);


//# sourceMappingURL=main.js.map
