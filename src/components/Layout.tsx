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
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
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

function AddMyCatForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm({
    schema: (z) =>
      z.object({
        name: z.string().min(1),
      }),
    initial: {
      name: "",
    },
  });

  const { mutate } = trpc.proxy.cats.create.useMutation({
    onMutate() {
      setIsSuccess(false);
    },
    onSuccess() {
      setIsSuccess(true);
    },
    onError(e) {
      form.setErrors(e.data.validationError?.fieldErrors ?? {});
    },
  });

  return (
    <form onSubmit={form.onSubmit((d) => mutate(d.name))}>
      <Input for={[form, "name"]} placeholder="Name of the cat" />
      <Group position="right" pt="xs">
        <Button
          type="submit"
          color={isSuccess ? "green" : "cyan"}
          size="xs"
          rightIcon={
            <Transition mounted={isSuccess} transition="scale-x">
              {(s) => <IconCheck style={s} />}
            </Transition>
          }
        >
          {isSuccess ? "Added" : "Add"}
        </Button>
      </Group>
    </form>
  );
}
