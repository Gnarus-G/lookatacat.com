import { AppShell, Box, Button, Group, Header, NavLink } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

const logout = () => signOut();

export default function Layout({
  children,
  headerActions,
}: {
  children: ReactNode;
  headerActions?: ReactNode;
}) {
  const session = useSession();
  const router = useRouter();

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
            <Box sx={{ marginRight: "auto" }}>
              <Link href="/cats" passHref>
                <NavLink
                  label="All Cats"
                  active={router.pathname === "/cats"}
                  variant="subtle"
                  sx={{ borderRadius: 5 }}
                />
              </Link>
            </Box>
            {headerActions}
            {session.status === "authenticated" ? (
              <Button color="gray" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Link href="/auth/signin">
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
