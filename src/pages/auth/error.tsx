import { Container, Text } from "@mantine/core";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import React from "react";

const errorMap: Record<string, string> = {
  Verification: "The token has expired or has already been used",
  Configuration: "Oops! We messed up!",
  AccessDenied: "You're not allowed 'round these parts!"
};

export default function AuthError() {
  const error = useRouter().query.error as string;
  return (
    <Layout>
      <Container size="xs" pt="xl">
        <Text align="center" size="xl" color="orange">
          {errorMap[error] ?? error}
        </Text>
      </Container>
    </Layout>
  );
}
