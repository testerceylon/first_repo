import { migrate } from "drizzle-orm/neon-http/migrator";

import { initDatabase } from "./index";

const main = async () => {
  try {
    const db = initDatabase(process.env.DATABASE_URL!);

    await migrate(db, { migrationsFolder: "src/database/migrations" });

    console.log("Migration completed");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

main();
