import { Button, Container, Stack, TextInput } from "@mantine/core";
import Layout from "components/Layout";
import { getCsrfToken } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { useRouter } from "next/router";

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { error } = useRouter().query;
  return (
    <Layout>
      <Container size="xs" pt="xl">
        <form method="post" action="/api/auth/signin/email">
          <Stack>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <TextInput
              label="Email address"
              type="email"
              id="email"
              name="email"
              error={error}
            />
            <Button type="submit" variant="gradient">
              Sign in with Email
            </Button>
          </Stack>
        </form>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
