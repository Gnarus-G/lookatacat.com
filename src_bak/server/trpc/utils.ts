import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import superjson from "superjson";
import { ZodError } from "zod";

export const t = initTRPC<{ ctx: Context }>()({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        validationError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      // infers that `session` is non-nullable to downstream resolvers
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
