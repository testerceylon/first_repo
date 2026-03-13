import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// Initialize and export the database instance
let db: NeonHttpDatabase<typeof schema> & {
  $client: NeonQueryFunction<false, false>;
};

export type Database = typeof db;

/**
 * Initialize the database connection
 * @param databaseUrl
 * @returns
 */
export function initDatabase(databaseUrl: string) {
  if (db) {
    return db;
  }

  // If no db instance, prepare and return
  const sql = neon(databaseUrl);
  db = drizzle(sql, { schema });

  return db;
}

/**
 * Get the database instance
 * @returns
 */
export function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized.");
  }

  return db;
}
