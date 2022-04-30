const Keyv = require("@keyvhq/core");
const KeyvSQLite = require("@keyvhq/sqlite");

const db = new Keyv({ store: new KeyvSQLite("sqlite://./database.sqlite") })


const toAdd = [
    { key: '602735169090224139', value: '"2022-04-27T16:10:33.462Z"' },
    { key: '602735169090224139-user', value: '<@772210230971858955>' },
    { key: '733202142927650957', value: '"2022-04-27T06:55:13.357Z"' },
    { key: '733202142927650957-user', value: '<@224122840163680256>' },
    { key: '801834790768082944', value: '"2022-04-22T22:12:29.679Z"' },
    { key: '801834790768082944-user', value: '<@532732357954895873>' },
    { key: '830968808973533234', value: '"2021-10-23T14:17:38.109Z"' },
    {
        key: '830968808973533234-last.txt',
        value: '"2021-10-20T16:27:05.627Z"'
    },
    { key: '830968808973533234-user', value: '<@786932050820726784>' },
    { key: '925097077913038938', value: '"2021-12-27T18:48:02.852Z"' },
    { key: '925097077913038938-user', value: '<@627853354445439009>' },

]

db.get("925097077913038938").then(console.log)