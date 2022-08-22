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
      const assetUpsertArg = {
        where: {
          url: input.url,
        },
        create: {
          url: input.url,
          forCat: { connect: { name: input.catName } },
        },
        update: {
          url: input.url,
        },
      };

      if (input.isVideo) {
        return ctx.prisma.catVideo.upsert(assetUpsertArg);
      }

      return ctx.prisma.catPic.upsert(assetUpsertArg);
    }),
  getOwnCats: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.cat.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
  }),
  getCatAssets: t.procedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.cat.findUnique({
      where: {
        name: input,
      },
      include: {
        owner: {
          select: { name: true },
        },
        pics: {
          select: {
            url: true,
          },
        },
        videos: {
          select: {
            url: true,
          },
        },
      },
    });
  }),
});
