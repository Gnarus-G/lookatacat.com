import { Box, Container, Grid } from "@mantine/core";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { env } from "../env/server.mjs";
import { trpc } from "../utils/trpc";

type Cat = {
  name: string;
  url: string;
  uploadedAt: number;
  isVideo: boolean;
};

type Props = {
  cats: Cat[];
};

const Home: NextPage<Props> = ({ cats }) => {
  const hello = trpc.proxy.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Marceline</title>
        <meta name="description" content="Marceline, the cutest cat?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container size="md" px="xs">
        <Grid gutter="md">
          {cats
            .sort((a, b) => +b.uploadedAt - +a.uploadedAt)
            .map(({ name, url, isVideo }) => (
              <Grid.Col key={name} xs={6} sm={4} md={3}>
                {isVideo ? (
                  <Box component="video" src={url} autoPlay loop playsInline>
                    <track kind="captions" />
                  </Box>
                ) : (
                  <Box
                    component={Image}
                    sx={(theme) => ({ borderRadius: theme.radius.lg })}
                    src={url}
                    loading="lazy"
                    objectFit="cover"
                    width="100%"
                    height="100%"
                    layout="responsive"
                    alt={`Marceline named as ${name}`}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
                  />
                )}
              </Grid.Col>
            ))}
        </Grid>
      </Container>
      <div>{hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}</div>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<Props> = async () => {
  type CatAsset = { path: string; type: string; uploadedAt: string };

  const objs = await fetch(env.WORKER_ENDPOINT)
    .then((res) => res.json())
    .then((d) => d.assets as CatAsset[]);

  const cats = objs.map((p) => ({
    name: p.path,
    url: `${env.WORKER_ENDPOINT}${p.path}`,
    uploadedAt: new Date(p.uploadedAt).getTime(),
    isVideo: p.type.includes("video"),
  }));

  return {
    props: { cats },
  };
};
