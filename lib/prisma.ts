import "dotenv/config";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaMssql({
  server: process.env.DB_HOST ?? "",
  port: Number(process.env.DB_PORT ?? "1433"),
  database: process.env.DB_NAME ?? "",
  user: process.env.DB_USER ?? "",
  password: process.env.DB_PASSWORD ?? "",
  options: {
    encrypt: (process.env.DB_ENCRYPT ?? "true") === "true",
    trustServerCertificate:
      (process.env.DB_TRUST_SERVER_CERTIFICATE ?? "false") === "true",
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
});
////////////////////////////////
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: [
      "query",
      "info",
      "warn",
      "error",
    ],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
///////////////////////////////
//export const prisma =
//  globalForPrisma.prisma ?? new PrismaClient({ adapter });

//if (process.env.NODE_ENV !== "production") {
//  globalForPrisma.prisma = prisma;
//}