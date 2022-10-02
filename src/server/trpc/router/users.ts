import { authedProcedure, t } from "../utils";
import { z } from "zod";
import { prisma } from "server/db/client";

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
});
