import {
  AppShell,
  Button,
  Container,
  Grid,
  Group,
  Header,
  Modal,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPhoto } from "@tabler/icons";
import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Cat, { CatAsset } from "../components/Cat";
import FileUpload from "../components/FileUpload";
import ModalCarousel from "../components/ModalCarousel";
import { env } from "../env/server.mjs";
import { trpc } from "../utils/trpc";

type Props = {
  cats: CatAsset[];
};

const Home: NextPage<Props> = ({ cats }) => {
  const hello = trpc.proxy.example.hello.useQuery({ text: "from tRPC" });

  const [opened, setOpened] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>();
  const [openedCarousel, setOpenedCarousel] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const session = useSession();

  return (
    <>
      <Head>
        <title>Marceline</title>
        <meta name="description" content="Marceline, the cutest cat?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        header={
          <Header
            sx={(theme) => ({
              backgroundColor: theme.colors.dark[6],
            })}
            height={60}
            p="xs"
          >
            <Group position="right">
              {session.status === "authenticated" && (
                <Button
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan" }}
                  onClick={() => setOpened(true)}
                  leftIcon={<IconPhoto />}
                >
                  Upload
                </Button>
              )}
              {session.status === "authenticated" ? (
                <Link href="/api/auth/signout">
                  <Button component="a" color="gray">
                    Logout
                  </Button>
                </Link>
              ) : (
                <Link href="/api/auth/signin">
                  <Button component="a">Login</Button>
                </Link>
              )}
            </Group>
          </Header>
        }
      >
        <Container size="md" px="xs">
          <Grid gutter="md" align="center">
            {cats.map((cat, index) => (
              <Grid.Col key={cat.name} xs={6} sm={4} md={3}>
                <Cat
                  {...cat}
                  onClick={() => {
                    setSelectedImage(index);
                    setOpenedCarousel(true);
                  }}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </AppShell>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Upload some more cats?"
      >
        <FileUpload />
      </Modal>
      <ModalCarousel
        opened={openedCarousel && !isMobile}
        withCloseButton={false}
        size="xl"
        centered
        transition="rotate-left"
        currentKey={selectedImage}
        onClose={() => setOpenedCarousel(false)}
        source={cats}
        keySelector={(cat) => cat.name}
        each={(cat) => <Cat {...cat} />}
      />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<Props> = async () => {
  type CatAsset = { path: string; type: string; uploadedAt: string };

  const catWorkerEndpoint = env.NEXT_PUBLIC_WORKER_ENDPOINT;

  const objs = await fetch(catWorkerEndpoint)
    .then((res) => res.json())
    .then((d) => d.assets as CatAsset[]);

  const cats = objs
    .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
    .map((p) => ({
      name: p.path,
      url: `${env.NEXT_PUBLIC_WORKER_ENDPOINT}${p.path}`,
      isVideo: p.type.includes("video"),
    }));

  return {
    props: { cats },
  };
};
