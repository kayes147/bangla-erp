import { PrismaClient } from '@prisma/client';

const SUPABASE_POOLED_URL = "postgresql://postgres.ljodeantrpexiuybgpfl:BanglaERP2026@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
const SUPABASE_DIRECT_URL = "postgresql://postgres.ljodeantrpexiuybgpfl:BanglaERP2026@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = SUPABASE_POOLED_URL;
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = SUPABASE_DIRECT_URL;
}
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "my_super_secret_for_next_auth_123!";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || SUPABASE_POOLED_URL,
      },
    },
  });

globalForPrisma.prisma = prisma;
