import { signIn } from "../../../auth";

export default function SignIn() {
  return (
    <form
      action={async (data) => {
        "use server";
        const email = data.get("email");
        await signIn("nodemailer", {
          email,
          redirectTo: "/cats",
        });
      }}
    >
      <input type="email" id="email" name="email" placeholder="Email" />
      <button type="submit">Signin with Email</button>
    </form>
  );
}
