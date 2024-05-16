import { createId } from "@paralleldrive/cuid2";
import {
  pgTable,
  index,
  primaryKey,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

const cuid = (column: string) =>
  varchar(column, { length: 128 })
    .notNull()
    .$defaultFn(() => createId());

export const Cat = pgTable(
  "cat",
  {
    id: cuid("id").primaryKey(),
    name: text("name").notNull(),
    ownerId: varchar("owner_id", { length: 128 }).notNull(),
    favoritePicUrl: text("favorite_pic_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      name_key: index("cat_name_key").on(table.name),
      favoritePicUrl_key: index("cat_favorite_pic_url_key").on(
        table.favoritePicUrl
      ),
    };
  }
);

export const CatPic = pgTable("cat_pic", {
  id: cuid("id").primaryKey(),
  url: text("url").notNull(),
  catId: varchar("cat_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const CatVideo = pgTable("cat_video", {
  id: cuid("id").primaryKey(),
  url: text("url").notNull(),
  catId: varchar("cat_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const Invitee = pgTable("invitee", {
  id: cuid("id").primaryKey(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Auth schemas

export const Users = pgTable("user", {
  id: cuid("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const Accounts = pgTable(
  "account",
  {
    userId: varchar("userId", { length: 128 })
      .notNull()
      .references(() => Users.id, { onDelete: "cascade" }),
    type: text("type").$type<string>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const Sessions = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const VerificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
