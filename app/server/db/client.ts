import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { z } from "zod";
import * as schema from "./schema";

// Get environment variables
const env = z.object({ DB_URL: z.string() }).parse(process.env);

// Create a DB client
const client = createClient({ url: env.DB_URL });

export const db = drizzle(client, { schema });
