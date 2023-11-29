import "dotenv/config";
import type { Config } from "drizzle-kit";
import { z } from "zod";

// Get environment variables
const env = z.object({ DB_URL: z.string() }).parse(process.env);

export default {
  schema: "./app/server/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "turso",
  dbCredentials: {
    url: env.DB_URL,
  },
} satisfies Config;
