import Link from "next/link";
import { auth, signIn, signOut } from "../auth";
import Upload from "./Upload";

export default async function Header() {
  const session = await auth();

  return (
    <header className="w-full flex items-center gap-5 p-3">
      <nav>
        <Link href="/cats" className="text-blue-300">
          All Cats
        </Link>
      </nav>
      <ul className="ml-auto flex items-center gap-5">
        {!session?.user && <SignIn />}
        {!!session?.user && (
          <>
            <Upload />
            <SignOut />
          </>
        )}
      </ul>
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
      <button type="submit" className="text-red-50">
        Sign Out
      </button>
    </form>
  );
}
