import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use your Neon database connection
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_HduBJ9phw1GL@ep-muddy-morning-ad4e2lhd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });
