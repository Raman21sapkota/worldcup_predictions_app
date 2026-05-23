import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis

function getAdapterOptions() {
  const url = process.env.DATABASE_URL || ""
  const needsSsl = url.includes("sslmode=require") || url.includes("ssl=true")
  const opts = { connectionString: url }
  if (needsSsl) {
    opts.ssl = { rejectUnauthorized: false }
  }
  return opts
}

let prisma
if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma
} else {
  prisma = new PrismaClient({
    adapter: new PrismaPg(getAdapterOptions()),
  })
  globalForPrisma.prisma = prisma
}

export default prisma
