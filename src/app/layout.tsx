import "../global.css";
import Header from "./components/Header";

export const metadata = {
  title: "lookatacat",
  description: "Where the cutest cat lies presented.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-dvh">
      <body className="bg-dark text-white h-full flex flex-col gap-3">
        <Header />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
