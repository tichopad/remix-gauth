import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { z } from "zod";

// Get environment variables
const env = z.object({ DB_URL: z.string() }).parse(process.env);

// Create a DB client
const client = createClient({ url: env.DB_URL });

export default drizzle(client);
