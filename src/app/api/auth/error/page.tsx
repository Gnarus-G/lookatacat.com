"use client";

const errorMap: Record<string, string> = {
  Verification: "The token has expired or has already been used",
  Configuration: "Oops! We messed up!",
  AccessDenied: "You're not allowed 'round these parts!",
};

export default function AuthError(props: { searchParams: { error: string } }) {
  const error = props.searchParams.error;
  return (
    <div>
      <p>{errorMap[error] ?? error}</p>
    </div>
  );
}
