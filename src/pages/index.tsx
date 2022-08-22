import {
  AppShell,
  Button,
  Container,
  Grid,
  Group,
  Header,
  Modal,
} from "@mantine/core";
import { createSSGHelpers } from "@trpc/react/ssg";
import superjson from "superjson";
import { prisma } from "server/db/client";
import { useMediaQuery } from "@mantine/hooks";
import { IconPhoto } from "@tabler/icons";
import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Cat from "../components/Cat";
import FileUpload from "../components/FileUpload";
import ModalCarousel from "../components/ModalCarousel";
import { appRouter } from "../server/trpc/router";
import { trpc } from "utils/trpc";

const Home: NextPage = () => {
  const session = useSession();
  const [opened, setOpened] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>();
  const [openedCarousel, setOpenedCarousel] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { data: cat } = trpc.proxy.cats.getCatAssets.useQuery("Marceline");
  const favorite = cat?.favoritePicUrl;

  const catAssets =
    cat?.videos
      .map<{ url: string; isVideo?: boolean }>((v) => ({
        url: v.url,
        isVideo: true,
      }))
      .concat(cat.pics) ?? [];

  return (
    <>
      <Head>
        <title>{cat?.name}</title>
        <meta name="description" content={`${cat?.name}, the cutest cat?`} />
        <link rel="icon" href={favorite ?? "/favicon.ico"} />
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
            {catAssets.map((asset, index) => (
              <Grid.Col
                key={asset.url}
                xs={6}
                sm={4}
                md={3}
                onClick={() => {
                  setSelectedImage(index);
                  setOpenedCarousel(true);
                }}
              >
                <Cat name={cat?.name} url={asset.url} isVideo={asset.isVideo} />
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
        source={catAssets}
        keySelector={(a) => a.url}
        each={(a) => <Cat name={cat?.name} url={a.url} isVideo={a.isVideo} />}
      />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson,
  });

  await ssg.fetchQuery("cats.getCatAssets", "Marceline");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
