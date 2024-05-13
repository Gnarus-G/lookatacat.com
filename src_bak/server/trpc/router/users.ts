import { authedProcedure, t } from "../utils";
import { z } from "zod";
import { prisma } from "server/db/client";
import { env } from "env/server.mjs";

export const usersRouter = t.router({
  invite: authedProcedure
    .input(
      z
        .string()
        .email()
        .refine(
          (email) =>
            prisma.invitee.findUnique({ where: { email } }).then((d) => !d),
          {
            message: "A user was already invited by that email.",
            path: ["email"],
          }
        )
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.invitee.create({
        data: {
          email: input,
        },
      });
    }),

  isAdmin: authedProcedure.query(({ ctx }) => {
    return ctx.session.user.email === env.ADMIN_EMAIL;
  }),
});
