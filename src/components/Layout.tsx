import { AppShell, Button, Group, Header } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { ReactNode } from "react";

export default function Layout({
  children,
  headerActions,
}: {
  children: ReactNode;
  headerActions?: ReactNode;
}) {
  const session = useSession();

  return (
    <AppShell
      header={
        <Header
          sx={(theme) => ({
            backgroundColor: theme.colors.dark[6],
          })}
          height={60}
          p="xs"
        >
          <Group position="right">
            {headerActions}
            {session.status === "authenticated" ? (
              <Link href="/api/auth/signout">
                <Button component="a" color="gray">
                  Logout
                </Button>
              </Link>
            ) : (
              <Link href="/api/auth/signin">
                <Button component="a">Login</Button>
              </Link>
            )}
          </Group>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
