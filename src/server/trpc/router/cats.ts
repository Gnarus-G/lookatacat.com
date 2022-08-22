import { authedProcedure, t } from "../utils";
import { z } from "zod";

export const catsRouter = t.router({
  create: authedProcedure.input(z.string().min(1)).mutation(({ input, ctx }) =>
    ctx.prisma.cat.create({
      data: { name: input, ownerId: ctx.session.user.id },
    })
  ),
  addAsset: t.procedure
    .input(
      z.object({ url: z.string(), catName: z.string(), isVideo: z.boolean() })
    )
    .mutation(({ input, ctx }) => {
      if (input.isVideo) {
        return ctx.prisma.catVideo.create({
          data: {
            url: input.url,
            forCat: { connect: { name: input.catName } },
          },
        });
      }
      return ctx.prisma.catPic.create({
        data: { url: input.url, forCat: { connect: { name: input.catName } } },
      });
    }),
  getOwnCats: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.cat.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
  }),
  getPics: t.procedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.catPic.findMany({
      where: {
        forCat: {
          name: input,
        },
      },
    });
  }),
});
