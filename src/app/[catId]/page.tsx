import { db } from "drizzle";
import { Cat, CatPic } from "drizzle/schema";
import { Metadata } from "next";
import { eq } from "drizzle-orm";
import Picture from "app/components/Picture";

type Props = {
  params: { catId: string };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const cat = await db.query.Cat.findFirst({
    where: eq(Cat.id, props.params.catId),
  });

  return {
    title: cat?.name,
  };
}

export default async function CatView(props: Props) {
  const [cat, pictures] = await Promise.all([
    db.query.Cat.findFirst({
      where: eq(Cat.id, props.params.catId),
    }),
    db.select().from(CatPic).where(eq(CatPic.catId, props.params.catId)),
  ]);

  return (
    <>
      <section
        id="pics"
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 w-full px-5 md:px-64 lg:px-96"
      >
        {pictures.map((c) => (
          <Picture key={c.id} {...c} catName={cat!.name} />
        ))}
      </section>
    </>
  );
}
