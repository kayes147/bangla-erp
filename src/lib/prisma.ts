import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

// Vercel Serverless read-only filesystem workaround for SQLite
if (process.env.NODE_ENV === 'production') {
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    try {
      fs.copyFileSync(dbPath, tmpDbPath);
      console.log('Copied SQLite DB to /tmp for write access.');
    } catch (e) {
      console.error('Failed to copy SQLite DB to /tmp:', e);
    }
  }
  dbPath = tmpDbPath;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
