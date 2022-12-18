import superjson from "superjson";
import { prisma } from "server/db/client";
import { Container, Grid, Group, NavLink, Text } from "@mantine/core";
import { createSSGHelpers } from "@trpc/react/ssg";
import Layout from "components/Layout";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { appRouter } from "server/trpc/router";
import { trpc } from "utils/trpc";
import Head from "next/head";

export default function Cats() {
  const { data: cats } = trpc.proxy.cats.getAllCats.useQuery();

  return (
    <Layout>
      <Head>
        <title>All cats</title>
      </Head>
      <Container size="md">
        <Grid>
          {cats?.map((c) => (
            <Grid.Col key={c.id} xs={6} sm={4} md={3}>
              <Image
                src={c.favoritePicUrl ?? ""}
                loading="lazy"
                objectFit="cover"
                width="100%"
                height="100%"
                layout="responsive"
                alt={c.name}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
              />
              <Group position="center" spacing={0} pt="xs">
                <Text>See more of</Text>
                <span>
                  <Link href={`/${c.name}`} passHref>
                    <NavLink label={c.name} sx={{ borderRadius: 5 }} />
                  </Link>
                </span>
              </Group>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson,
  });

  await ssg.fetchQuery("cats.getAllCats");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
