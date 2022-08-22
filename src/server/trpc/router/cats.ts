import { authedProcedure, t } from "../utils";
import { z } from "zod";
import { getBaseUrl } from "utils/trpc";
import { env } from "env/server.mjs";

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
    .mutation(async ({ input: { url, catName, isVideo }, ctx }) => {
      const assetUpsertArg = {
        where: {
          url: url,
        },
        create: {
          url: url,
          forCat: { connect: { name: catName } },
        },
        update: {
          url: url,
        },
      };

      if (isVideo) {
        await ctx.prisma.catVideo.upsert(assetUpsertArg);
        fetch(
          `${getBaseUrl()}/api/revalidate?secret=${env.REVALIDATION_SECRET}`
        );
      }
      await ctx.prisma.catPic.upsert(assetUpsertArg);
      fetch(`${getBaseUrl()}/api/revalidate?secret=${env.REVALIDATION_SECRET}`);
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
