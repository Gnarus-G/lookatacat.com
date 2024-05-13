import "dotenv/config"; // make sure to install dotenv package
import type { Config } from "drizzle-kit";

export default {
  dialect: "mysql",
  out: "./src/drizzle",
  schema: "./src/drizzle/schema.ts",
  introspect: {
    casing: "preserve",
  },
  dbCredentials: {
    url: 'mysql://adsfa:asdfasdf/cats?ssl={"rejectUnauthorized":true}',
  },
  /* dbCredentials: { */
  /*   host: process.env.DATABASE_HOST!, */
  /*   user: process.env.DATABASE_USERNAME!, */
  /*   password: process.env.DATABASE_PASSWORD, */
  /*   database: "cats", */
  /* }, */
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
