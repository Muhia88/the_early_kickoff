import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded" : "Not Loaded");

export const db = drizzle(client, { schema });