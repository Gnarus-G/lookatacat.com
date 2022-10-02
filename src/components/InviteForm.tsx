import { Button, Group } from "@mantine/core";
import React from "react";
import { useForm } from "react-form-z";
import { trpc } from "utils/trpc";
import { FormInput } from "./form-inputs";

export function InviteForm() {
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
      <FormInput for={[form, "email"]} placeholder="Invitee's email..." />
      <Group position="right" pt="xs">
        <Button type="submit" color="cyan" size="xs">
          Invite
        </Button>
      </Group>
    </form>
  );
}
