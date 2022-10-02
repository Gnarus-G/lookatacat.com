// src/server/trpc/router/index.ts
import { t } from "../utils";
import { catsRouter } from "./cats";
import { authRouter } from "./auth";
import { usersRouter } from "./users";

export const appRouter = t.router({
  cats: catsRouter,
  auth: authRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
