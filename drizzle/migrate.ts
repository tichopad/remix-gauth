import { createClient } from "@libsql/client";
import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { z } from "zod";

// Get environment variables
const env = z.object({ DB_URL: z.string() }).parse(process.env);

const db = drizzle(createClient({ url: env.DB_URL }));

async function main() {
  try {
    await migrate(db, { migrationsFolder: "drizzle/migrations" });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

main();
