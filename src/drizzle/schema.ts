import {
  pgTable,
  index,
  primaryKey,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const Cat = pgTable(
  "cat",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    ownerId: varchar("ownerId", { length: 191 }).notNull(),
    favoritePicUrl: varchar("favoritePicUrl", { length: 191 }),
  },
  (table) => {
    return {
      name_key: index("Cat_name_key").on(table.name),
      favoritePicUrl_key: index("Cat_favoritePicUrl_key").on(
        table.favoritePicUrl
      ),
      Cat_id: primaryKey({ columns: [table.id], name: "Cat_id" }),
    };
  }
);

export const CatPic = pgTable("cat_pic", {
  url: varchar("url", { length: 191 }).notNull(),
  catId: varchar("catId", { length: 191 }).notNull(),
});

export const CatVideo = pgTable("cat_video", {
  url: varchar("url", { length: 191 }).notNull(),
  catId: varchar("catId", { length: 191 }).notNull(),
});

export const Invitee = pgTable("invitee", {
  email: varchar("email", { length: 191 }).notNull(),
});

// Auth schemas

export const Users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const Accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => Users.id, { onDelete: "cascade" }),
    type: text("type").$type<string>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const Sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
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
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
