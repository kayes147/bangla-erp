import type { NextConfig } from "next";

const DB_URL = "postgresql://postgres.ljodeantrpexiuybgpfl:BanglaERP2026@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: DB_URL,
    DIRECT_URL: DB_URL,
    AUTH_SECRET: "my_super_secret_for_next_auth_123!",
    AUTH_TRUST_HOST: "true",
  },
};

export default nextConfig;
