import { insertCat } from "app/actions";

export default async function Page() {
  return (
    <>
      <form
        action={async (data) => {
          "use server";
          const name = data.get("name")! as string;
          return insertCat(name);
        }}
      >
        <input id="name" name="name" type="text" />
        <button>Add</button>
      </form>
    </>
  );
}
