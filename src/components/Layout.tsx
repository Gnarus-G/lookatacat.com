import {
  AppShell,
  Box,
  Button,
  Footer,
  Group,
  Header,
  Modal,
  NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { trpc } from "utils/trpc";
import { AddMyCatForm } from "./AddMyCatForm";
import { InviteForm } from "./InviteForm";

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
  const [inviteUserDialogIsOpen, inviteDialog] = useDisclosure(false);
  const [addMyCatDialogIsOpen, addMyCatDialog] = useDisclosure(false);
  const { data: isAdmin } = trpc.proxy.users.isAdmin.useQuery();

  return (
    <AppShell
      header={
        <Header height={60} p="xs" withBorder={false}>
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
      footer={
        <Footer height={60} p="sm" withBorder={false}>
          {isAdmin && (
            <>
              <Button
                variant="subtle"
                color="grape"
                onClick={inviteDialog.open}
              >
                Invite a cat lover
              </Button>
              <Modal
                opened={inviteUserDialogIsOpen}
                onClose={inviteDialog.close}
                title="Invite a cat lover"
              >
                <InviteForm />
              </Modal>
            </>
          )}
          {session.status === "authenticated" && (
            <>
              <Button variant="subtle" onClick={addMyCatDialog.open}>
                Add my cat
              </Button>
              <Modal
                opened={addMyCatDialogIsOpen}
                onClose={addMyCatDialog.close}
                title="Add my cat"
              >
                <AddMyCatForm />
              </Modal>
            </>
          )}
        </Footer>
      }
    >
      {children}
    </AppShell>
  );
}
