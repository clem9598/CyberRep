import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString = process.env.DATABASE_URL;

function createMissingDatabaseProxy(): PrismaClient {
  const error = new Error("DATABASE_URL is required to initialize Prisma.");

  return new Proxy(
    {},
    {
      get() {
        throw error;
      },
    },
  ) as PrismaClient;
}

const prismaClient = connectionString
  ? new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    })
  : createMissingDatabaseProxy();

export const db = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production" && connectionString) {
  globalForPrisma.prisma = db;
}
