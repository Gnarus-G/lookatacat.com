import {
  pgTable,
  index,
  primaryKey,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const Account = pgTable(
  "Account",
  {
    id: varchar("id", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 191 }),
    scope: varchar("scope", { length: 191 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 191 }),
  },
  (table) => {
    return {
      provider_providerAccountId_key: index(
        "Account_provider_providerAccountId_key"
      ).on(table.provider, table.providerAccountId),
      Account_id: primaryKey({ columns: [table.id], name: "Account_id" }),
    };
  }
);

export const Cat = pgTable(
  "Cat",
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

export const CatPic = pgTable("CatPic", {
  url: varchar("url", { length: 191 }).notNull(),
  catId: varchar("catId", { length: 191 }).notNull(),
});

export const CatVideo = pgTable("CatVideo", {
  url: varchar("url", { length: 191 }).notNull(),
  catId: varchar("catId", { length: 191 }).notNull(),
});

export const Invitee = pgTable("Invitee", {
  email: varchar("email", { length: 191 }).notNull(),
});

export const Session = pgTable(
  "Session",
  {
    id: varchar("id", { length: 191 }).notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: timestamp("expires", { mode: "string", precision: 3 }).notNull(),
  },
  (table) => {
    return {
      sessionToken_key: index("Session_sessionToken_key").on(
        table.sessionToken
      ),
      Session_id: primaryKey({ columns: [table.id], name: "Session_id" }),
    };
  }
);

export const User = pgTable(
  "User",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }),
    emailVerified: timestamp("emailVerified", { mode: "string", precision: 3 }),
    image: varchar("image", { length: 191 }),
  },
  (table) => {
    return {
      email_key: index("User_email_key").on(table.email),
      User_id: primaryKey({ columns: [table.id], name: "User_id" }),
    };
  }
);

export const VerificationToken = pgTable(
  "VerificationToken",
  {
    identifier: varchar("identifier", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    expires: timestamp("expires", { mode: "string", precision: 3 }).notNull(),
  },
  (table) => {
    return {
      token_key: index("VerificationToken_token_key").on(table.token),
      identifier_token_key: index("VerificationToken_identifier_token_key").on(
        table.identifier,
        table.token
      ),
    };
  }
);
