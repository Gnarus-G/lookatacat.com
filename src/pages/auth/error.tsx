import { Container, Text } from "@mantine/core";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import React from "react";

export default function AuthError() {
  const { error } = useRouter().query;
  return (
    <Layout>
      <Container size="xs" pt="xl">
        <Text align="center" size="xl" color="orange">{error}</Text>
      </Container>
    </Layout>
  );
}
