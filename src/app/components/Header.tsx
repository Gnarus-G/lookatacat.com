import Link from "next/link";
import { auth, signIn, signOut } from "../auth";
import Upload from "./Upload";
import Button from "./Button";

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
      <Button type="submit">Sign In</Button>
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
      <Button type="submit" className="bg-gray-600 hover:bg-gray-700">
        Sign Out
      </Button>
    </form>
  );
}
