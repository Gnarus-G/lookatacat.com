import Link from "next/link";
import { auth, signIn, signOut } from "../auth";
import Upload from "./Upload";

export default async function Header() {
  const session = await auth();

  return (
    <header className="flex gap-5">
      <nav>
        <Link href="/cats">All Cats</Link>
      </nav>
      {!session?.user && <SignIn />}
      {!!session?.user && <SignOut />}
      {!!session?.user && <Upload />}
    </header>
  );
}

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <button type="submit">Sign In</button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
