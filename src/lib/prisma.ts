import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import fs from "fs";
import path from "path";

neonConfig.webSocketConstructor = ws;

declare global {
  // eslint-disable-next-line no-var
  var __prisma_neon: PrismaClient | undefined;
}

function readDatabaseUrl(): string {
  // 1. Try process.env first
  let url = process.env.DATABASE_URL;
  if (url) {
    url = url.trim().replace(/^["']|["']$/g, "");
    if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
      return url;
    }
  }

  // 2. Fallback: read .env file directly (handles Turbopack env-loading issues)
  try {
    const envPath = path.resolve(
      process.cwd() || "d:\\xampp\\htdocs\\construction_expense_tracker",
      ".env"
    );
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      for (const line of content.split(/\r?\n/)) {
        const match = line.match(/^DATABASE_URL\s*=\s*(.+)$/);
        if (match) {
          const val = match[1].trim().replace(/^["']|["']$/g, "");
          if (val.startsWith("postgresql://") || val.startsWith("postgres://")) {
            console.log("[prisma] DATABASE_URL read directly from .env file");
            return val;
          }
        }
      }
    }
  } catch (err) {
    console.error("[prisma] Error reading .env:", err);
  }

  throw new Error("[prisma] DATABASE_URL not found. Check your .env file.");
}

function createPrismaClient(): PrismaClient {
  const connectionString = readDatabaseUrl();

  // Parse URL manually to bypass Turbopack's broken pg-connection-string bundling
  const parsed = new URL(connectionString);

  // PrismaNeon v7 takes a PoolConfig directly (NOT a Pool instance)
  const poolConfig = {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 5432,
    database: parsed.pathname.replace(/^\//, ""),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    ssl: true,
  };

  console.log(
    `[prisma] Connecting → host=${parsed.hostname} db=${parsed.pathname.slice(1)}`
  );

  // ✅ PrismaNeon accepts PoolConfig directly in v7 (not a Pool instance)
  const adapter = new PrismaNeon(poolConfig);

  return new PrismaClient({ adapter });
}

/**
 * Singleton PrismaClient — lazy-initialised on first access.
 */
export const prisma: PrismaClient =
  global.__prisma_neon ??
  (() => {
    const client = createPrismaClient();
    if (process.env.NODE_ENV !== "production") {
      global.__prisma_neon = client;
    }
    return client;
  })();
