import { config } from "dotenv"; // make sure to install dotenv package
import type { Config } from "drizzle-kit";

config({
  path: [".env.development", ".env.local"],
  override: true,
});

export default {
  dialect: "postgresql",
  out: "./src/drizzle",
  schema: "./src/drizzle/schema.ts",
  introspect: {
    casing: "preserve",
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Print all statements
  verbose: true,
} satisfies Config;
