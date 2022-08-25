import { Container, Text, Title } from "@mantine/core";
import Layout from "components/Layout";
import React from "react";

export default function FourOFour() {
  return (
    <Layout>
      <Container size="xs" pt="xl">
        <Title align="center" variant="gradient">
          404
        </Title>
        <Text align="center" size="xl">
          This page could not be found.
        </Text>
      </Container>
    </Layout>
  );
}
