import { db } from "drizzle";
import { Invitee } from "drizzle/schema";
import { Metadata } from "next";

type Props = {
  params: { catName: string };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  return {
    title: props.params.catName,
  };
}

export default async function CatView(props: Props) {
  const test = await db.select().from(Invitee);
  return (
    <>
      {props.params.catName} {test}
    </>
  );
}
