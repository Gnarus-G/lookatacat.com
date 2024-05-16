import { db } from "drizzle";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "All cats",
};

export default async function Home() {
  const cats = await db.query.Cat.findMany({
    with: {
      pics: {
        columns: {
          url: true,
        },
        limit: 1,
      },
    },
  });

  return (
    <>
      <ul className="container mx-auto h-full p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {cats.map((c) => (
          <figure key={c.id}>
            <div className="relative w-40 rounded aspect-square">
              <Image
                src={c.favoritePicUrl ?? c.pics?.[0]?.url ?? ""}
                style={{ objectFit: "cover" }}
                fill
                sizes="(max-width: 768px) 90vw, 250px"
                alt={c.name}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
              />
            </div>
            <figcaption className="text-slate-300">
              See more of{" "}
              <Link href={`/${c.id}`} className="text-slate-200">
                {c.name}
              </Link>
            </figcaption>
          </figure>
        ))}
      </ul>
    </>
  );
}
