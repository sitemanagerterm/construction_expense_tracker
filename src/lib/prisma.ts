import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "fs";
import path from "path";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function readDatabaseUrl(): string {
  // Try process.env first
  const fromEnv = process.env.DATABASE_URL;
  if (fromEnv) return fromEnv;

  // Fallback: manually parse .env file line by line
  try {
    const envPath = fs.existsSync(path.resolve(process.cwd(), ".env"))
      ? path.resolve(process.cwd(), ".env")
      : "d:\\xampp\\htdocs\\construction_expense_tracker\\.env";

    const lines = fs.readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("DATABASE_URL")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          let val = trimmed.slice(eqIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (val) {
            console.log("[prisma] DATABASE_URL loaded directly from .env");
            return val;
          }
        }
      }
    }
  } catch (err) {
    console.error("[prisma] Could not read .env:", err);
  }

  throw new Error("[prisma] DATABASE_URL is not set. Check your .env file.");
}

function createPrismaClient(): PrismaClient {
  const connectionString = readDatabaseUrl();
  console.log(
    "[prisma] Creating PrismaClient (pg adapter) with URL:",
    connectionString.substring(0, 45) + "..."
  );

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/**
 * Lazy singleton — PrismaClient is only created on first property access,
 * NOT at module import time. This ensures DATABASE_URL is loaded by Next.js
 * before we read it.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!global.__prisma) {
      global.__prisma = createPrismaClient();
    }
    const client = global.__prisma;
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
