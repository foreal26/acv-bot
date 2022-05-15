import { PrismaClient } from '@prisma/client'
//@ts-ignore
import Sheets from "node-sheets"
const prisma = new PrismaClient()

const getTable = async () => {
    const gs = new Sheets(process.env["SHEET_ID"]);
    await gs.authorizeApiKey(process.env["GOOGLE_API_KEY"]);
    return await gs.tables("Responses!A:D");
}

type Row = {
    [id: string]: { value: string, stringValue: string };
}

type GSheet = {
    rows: Row[]
}

async function main() {
    const rawQuotes: GSheet = await getTable();
    rawQuotes.rows.map(async (row: Row) => {
        const timestamp = row.Timestamp.stringValue.trim()
        const author = row.Author.stringValue.trim()
        const quote = row.Quote.stringValue.trim()
        let link = row.Link ? row.Link.stringValue.trim() : ""
        if (!link.match(/^https?:\/\//)) {
            link = null
        }
        await prisma.quotes.create({
            data: { timestamp, author, quote, link }
        })
    })
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })