import { Button, Group, Transition } from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import React, { useState } from "react";
import { useForm } from "react-form-z";
import { trpc } from "utils/trpc";
import { FormInput } from "./form-inputs";

export function AddMyCatForm() {
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
      <FormInput for={[form, "name"]} placeholder="Name of the cat" />
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
