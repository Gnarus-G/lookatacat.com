"use server";

import { db } from "drizzle";
import { Cat, CatPic, CatVideo } from "drizzle/schema";
import { auth } from "./auth";
import { eq } from "drizzle-orm";

export async function insertCat(name: string) {
  const s = await auth();
  await db.insert(Cat).values({
    name,
    ownerId: s!.user!.id,
  });
}

export async function addAsset(props: {
  url: string;
  isVideo: boolean;
  catName: string;
}) {
  const [cat] = await db
    .select({
      id: Cat.id,
    })
    .from(Cat)
    .where(eq(Cat.name, props.catName));

  if (props.isVideo) {
    return await db.insert(CatVideo).values({
      url: props.url,
      catId: cat!.id,
    });
  }

  await db.insert(CatPic).values({
    url: props.url,
    catId: cat!.id,
  });
}

export async function deletePicture(id: string, url: string) {
  await db.delete(CatPic).where(eq(CatPic.id, id));

  await fetch(url, {
    method: "DELETE",
    headers: {
      "X-Custom-Auth-Key": process.env.NEXT_PUBLIC_WORKER_ENDPOINT_AUTH_KEY!,
    },
  });
}
