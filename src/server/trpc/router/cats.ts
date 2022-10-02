import { authedProcedure, t } from "../utils";
import { z } from "zod";
import { getBaseUrl } from "utils/trpc";
import { prisma } from "server/db/client";
import { env } from "env/server.mjs";

export const catsRouter = t.router({
  create: authedProcedure
    .input(
      z
        .string()
        .min(1)
        .refine(
          (name) =>
            prisma.cat.findUnique({ where: { name } }).then((cat) => !cat),
          {
            message: "A cat by that name has already been added",
            path: ["name"],
          }
        )
    )
    .mutation(async ({ input, ctx }) => {
      const createdCat = await ctx.prisma.cat.create({
        data: { name: input, ownerId: ctx.session.user.id },
      });

      await revalidate("cats");
      await revalidate(createdCat.name);

      return createdCat;
    }),
  getOwner: t.procedure.input(z.string()).query(({ input, ctx }) =>
    ctx.prisma.cat
      .findUnique({
        where: {
          name: input,
        },
      })
      .owner()
  ),
  favoritePic: authedProcedure
    .input(z.object({ url: z.string().url(), catName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const r = await ctx.prisma.cat.update({
        where: { name: input.catName },
        data: { favoritePic: { connect: { url: input.url } } },
      });
      await revalidate(input.catName);
      return r;
    }),
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
        revalidate(catName);
      }
      await ctx.prisma.catPic.upsert(assetUpsertArg);
      revalidate(catName);
    }),
  getAllCats: t.procedure.query(({ ctx }) => {
    return ctx.prisma.cat.findMany();
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
  trashPic: authedProcedure
    .input(z.string().url())
    .mutation(async ({ input, ctx }) => {
      const pic = await ctx.prisma.catPic.delete({
        where: { url: input },
        select: {
          forCat: {
            select: {
              name: true,
            },
          },
        },
      });
      await fetch(input, {
        method: "DELETE",
        headers: {
          "X-Custom-Auth-Key": env.NEXT_PUBLIC_WORKER_ENDPOINT_AUTH_KEY,
        },
      });
      await revalidate(pic.forCat.name);
    }),
});

function revalidate(page: string) {
  return fetch(
    `${getBaseUrl()}/api/revalidate?secret=${
      env.REVALIDATION_SECRET
    }?page=${page}`
  );
}
