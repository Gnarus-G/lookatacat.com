import { Mail } from "lucide-react";
import { signIn } from "../../../auth";
import Button from "app/components/Button";

export default function SignIn() {
  return (
    <div className="container mx-auto max-w-md">
      <form
        className="flex flex-col gap-5"
        action={async (data) => {
          "use server";
          const email = data.get("email");
          await signIn("nodemailer", {
            email,
            redirectTo: "/cats",
          });
        }}
      >
        <label className="flex flex-col">
          <span className="text-slate-400">Email Address:</span>
          <input
            className="p-1 border border-solid border-slate-400 rounded"
            type="email"
            id="email"
            name="email"
          />
        </label>
        <Button
          type="submit"
          className="flex gap-1 items-center justify-center bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
        >
          <Mail className="mr-2 h-4 w-4" strokeWidth={3} />
          Signin with Email
        </Button>
      </form>
    </div>
  );
}
