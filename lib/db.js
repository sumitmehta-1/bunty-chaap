// lib/db.js
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const globalForPrisma = globalThis

function createPrismaClient() {
  // Use absolute path to the DB file to avoid CWD issues
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const dbPath = join(__dirname, '..', 'prisma', 'dev.db')
  console.log('[DB] Connecting to:', dbPath)
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
