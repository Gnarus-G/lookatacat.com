import { Container, Text, Title } from "@mantine/core";
import Layout from "components/Layout";
import React from "react";

export default function VerifyEmail() {
  return (
    <Layout>
      <Container size="xs" pt="xl">
        <Title align="center" variant="gradient">Check your email</Title>
        <Text align="center" size="xl">
          A sign in link has been sent to your email address.
        </Text>
      </Container>
    </Layout>
  );
}
