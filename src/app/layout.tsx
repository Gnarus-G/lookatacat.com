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
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
