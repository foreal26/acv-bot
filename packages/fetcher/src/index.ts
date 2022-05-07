import fastify from 'fastify'
import ratelimit from "@fastify/rate-limit"
import cors from "@fastify/cors"
import fastifystatic from "@fastify/static"
import path from "path"
import { PrismaClient } from '@prisma/client'
import { base, layout } from "./view/layout"

const __dirname = path.resolve(path.dirname(''));
const prisma = new PrismaClient()
const app = fastify({ logger: true })

app.register(ratelimit, {
    max: 100,
    timeWindow: '1 minute'
})
app.register(cors, { origin: "*" })



app.register(fastifystatic, {
    root: path.join(__dirname, "..", "editor", "public"),

})

app.get('/', async (req, res) => {
    res.redirect('https://flowerpotprompts.com')
})

app.get('/quote', async (req, res) => {
    if (req.headers.accept.includes('application/json')) {
        if (req.headers.authorization !== "Bearer 394ACFC13B25CE37EA89F02338A753E8A33FA5B654EF98ED26720E86CC6A6036") {
            res.status(404).send({ error: 'Invalid authentication. Make sure you set the Authorization header and the value includes "Bearer "' })
        }
        const allQuotes = await prisma.quotes.findMany()
        console.log(allQuotes)
        res.send(allQuotes || [])
    } else {
        res.sendFile('index.html')
    }
})

interface ITimestampQuery {
    timestamp?: string
}

app.get<{ Querystring: ITimestampQuery }>('/quote/edit', async (req, res) => {
    const { timestamp } = req?.query;
    if (!timestamp) {
        res.status(404).send({ error: 'You must provide a ?timestamp value to edit' })
    }
    const quote = await prisma.quotes.findFirst({ where: { timestamp: timestamp } })
    if (!quote) {
        return res.send(base())
    }
    res.type('text/html').send(layout(`<form onsubmit="onSubmit(event)">
    <div>
    <span>Timestamp</span>
    <input id="timestamp" type="text" placeholder="timestamp" value="${quote.timestamp}"/>
    </div>
    <div>
    <span>Author</span>
    <input id="author" type="text" placeholder="author" value="${quote.author}"/>
    </div>
    <div>
    <span>Quote</span>
    <textarea id="quote" type="text" placeholder="quote" cols="80" rows="20">${quote.quote}</textarea>
    </div>
    <div>
    <span>Link</span>
    <input id="link" type="url" placeholder="link" value="${quote.link}"/>
    </div>
    <div>
    <span>Passcode</span>
    <input id="auth" type="password" />
    </div>
    <button>Edit</button>
    </form>

    <script>
    function onSubmit(e) {
        e.preventDefault()
        const author = document.getElementById("author").value
        const link = document.getElementById("link").value
        const quote = document.getElementById("quote").value
        const timestamp = "${timestamp}"
        const auth = document.getElementById("auth").value
        fetch("/quote/edit?timestamp=" + timestamp, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + auth
            }
            body: JSON.stringify({ author, link, quote, timestamp })
        })
        .then(res => {
            const newNode = document.createElement("h1")
            if (res.status === 200) {
                newNode.innerText = "Success"
            } else {
                newNode.innerText = "Something went wrong. Contact Foreal"
            }
            document.body.replaceWith(newNode)
        })
    }
    </script>`))
})

app.get<{ Querystring: ITimestampQuery }>('/quote/delete', async (req, res) => {
    const { timestamp } = req?.query;
    if (!timestamp) {
        res.status(404).send({ error: 'You must provide a ?timestamp value to edit' })
    }
    const quote = await prisma.quotes.findFirst({ where: { timestamp } })
    if (!quote) {
        return res.send(base())
    }
    res.type('text/html').send(layout(`<form onsubmit="onSubmit(event)">
    <h2>Are you sure this is the quote you want to delete</h2>
    <div>
    <span>Quote</span>
    <textarea id="quote" type="text" placeholder="quote" cols="80">${quote.quote}</textarea>
    </div>
    <div>
    <span>Passcode</span>
    <input id="auth" type="password" />
    </div>
    <button>Delete</button>
    </form>

    <script>
    function onSubmit(e) {
        e.preventDefault()
        const timestamp = "${timestamp}"
        const auth = document.getElementById("auth").value
        fetch("/quote/delete?timestamp=" + timestamp, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + auth
            }
        })
        .then(res => {
            const newNode = document.createElement("h1")
            if (res.status === 200) {
                newNode.innerText = "Success"
            } else {
                newNode.innerText = "Something went wrong. Contact Foreal"
            }
            document.body.replaceWith(newNode)
        })
    }
    </script>`))
})

interface IQuoteBody {
    timestamp: string,
    quote: string,
    author: string,
    link: string,

}

app.post<{ Body: IQuoteBody }>("/quote/new", async (req, res) => {
    const { timestamp, quote, author, link } = req.body;
    console.log(`Persisting ${timestamp} record to DB`)
    if (timestamp && quote && author) {
        await prisma.quotes.create({ data: { timestamp, quote, author, link } })
    }
    res.send({ success: true })
})

app.post<{ Querystring: ITimestampQuery, Body: IQuoteBody }>("/quote/edit", async (req, res) => {
    const { timestamp } = req?.query
    if (!timestamp) {
        res.status(404).send({ error: 'You must provide a ?timestamp value to edit' })
    }
    if (req.headers.authorization !== "Bearer 394ACFC13B25CE37EA89F02338A753E8A33FA5B654EF98ED26720E86CC6A6036") {
        res.status(404).send({ error: 'Invalid authentication. Make sure you set the Authorization header and the value includes "Bearer "' })
    }
    console.log(`Editing ${timestamp} record in DB`)
    await prisma.quotes.update({ data: { ...req.body }, where: { timestamp } })
    res.send({ success: true })
})

app.delete<{ Querystring: ITimestampQuery }>("/quote/delete", async (req, res) => {
    const { timestamp } = req?.query
    if (!timestamp) {
        res.status(404).send({ error: 'You must provide a ?timestamp value to edit' })
    }
    if (req.headers.authorization !== "Bearer 394ACFC13B25CE37EA89F02338A753E8A33FA5B654EF98ED26720E86CC6A6036") {
        res.status(404).send({ error: 'Invalid authentication. Make sure you set the Authorization header and the value includes "Bearer "' })
    }
    console.log(`Deleting ${timestamp} record from DB`)
    await prisma.quotes.delete({ where: { timestamp } })
    res.send({ success: true })
})

app.get("/healthcheck", (req, res) => {
    res.send("Ack\n")
})

app.listen(3000, () => {
    console.log(`Quotes Responder listening on port 3000`)
})
