import {
  AppShell,
  Box,
  Button,
  Footer,
  Group,
  Header,
  Modal,
  NavLink,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { createFormInput, useForm } from "react-form-z";
import { trpc } from "utils/trpc";

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

  return (
    <AppShell
      header={
        <Header
          sx={(theme) => ({
            backgroundColor: theme.colors.dark[6],
            boxShadow: `0 5px 30px ${theme.colors.dark[6]}, 0 10px 50px ${theme.colors.dark[6]}, 0 15px 70px ${theme.colors.dark[6]}`,
          })}
          height={60}
          p="xs"
          withBorder={false}
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
      footer={
        <Footer height={60} p="sm" withBorder={false}>
          <Button variant="subtle" color="grape" onClick={inviteDialog.open}>
            Invite a cat lover
          </Button>
          <Modal
            opened={inviteUserDialogIsOpen}
            onClose={inviteDialog.close}
            title="Invite a cat lover"
          >
            <InviteForm />
          </Modal>
        </Footer>
      }
    >
      {children}
    </AppShell>
  );
}

const Input = createFormInput(TextInput);

function InviteForm() {
  const form = useForm({
    schema: (z) =>
      z.object({
        email: z.string().email(),
      }),
    initial: {
      email: "",
    },
  });

  const { mutate } = trpc.proxy.users.invite.useMutation({
    onError(e) {
      const errors = e.data.validationError?.fieldErrors ?? {};
      form.setErrors(errors);
    },
  });

  return (
    <form onSubmit={form.onSubmit((d) => mutate(d.email))}>
      <Input for={[form, "email"]} placeholder="Invitee's email..." />
      <Group position="right" pt="xs">
        <Button type="submit" color="cyan" size="xs">
          Invite
        </Button>
      </Group>
    </form>
  );
}
