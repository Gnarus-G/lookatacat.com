import {
  Button,
  Container,
  Grid,
  Modal,
  Space,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { createSSGHelpers } from "@trpc/react/ssg";
import superjson from "superjson";
import { prisma } from "server/db/client";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowsMaximize, IconPhoto } from "@tabler/icons";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import CatPic, { CatVideo } from "../components/Cat";
import FileUpload from "../components/FileUpload";
import ModalCarousel from "../components/ModalCarousel";
import { appRouter } from "../server/trpc/router";
import { trpc } from "utils/trpc";
import Layout from "components/Layout";

type Params = {
  catName: string;
};

const CatPage: NextPage<Params> = ({ catName }) => {
  const session = useSession();
  const [opened, setOpened] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>();
  const [openedCarousel, setOpenedCarousel] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { data: cat } = trpc.proxy.cats.getCatAssets.useQuery(catName);
  const weGotVids = !!cat?.videos.length;

  return (
    <>
      <Head>
        <title>{catName}</title>
        <link rel="icon" href={"/favicon.ico"} />
        <meta name="author" content="Gnarus" />
        <meta name="description" content="The cutest cat?" />
        <meta name="og:title" content={catName} />
        <meta name="og:image" content={cat?.favoritePicUrl ?? ""} />
        <meta name="og:description" content="The cutest cat?" />
      </Head>
      <Layout
        headerActions={
          session.status === "authenticated" && (
            <Button
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              onClick={() => setOpened(true)}
              leftIcon={<IconPhoto />}
            >
              Upload
            </Button>
          )
        }
      >
        <Container size="md" p="xl">
          {weGotVids && (
            <>
              <Title order={2}>Videos</Title>
              <Space h="xl" />
            </>
          )}
          <Grid gutter="md" align="center">
            {cat?.videos.map((asset) => (
              <Grid.Col key={asset.url} xs={6} sm={4} md={3}>
                <CatVideo src={asset.url} />
              </Grid.Col>
            ))}
          </Grid>
          <Space h="xl" />
          <Title order={2}>Pictures</Title>
          <Space h="xl" />
          <Grid gutter="md" align="center">
            {cat?.pics.map((asset, index) => (
              <Grid.Col
                key={asset.url}
                xs={6}
                sm={4}
                md={3}
                sx={{ position: "relative" }}
              >
                <ThemeIcon
                  hidden={isMobile}
                  m={5}
                  p={3}
                  sx={(theme) => ({
                    position: "absolute",
                    zIndex: 1,
                    right: 7,
                    cursor: "pointer",
                    transition: "background-color 100ms ease-in-out",
                    "&:hover": {
                      backgroundColor: theme.colors.blue,
                    },
                  })}
                  variant="light"
                  onClick={() => {
                    setSelectedImage(index);
                    setOpenedCarousel(true);
                  }}
                >
                  <IconArrowsMaximize />
                </ThemeIcon>
                <CatPic
                  name={catName}
                  url={asset.url}
                  isFave={asset.url === cat.favoritePicUrl}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Layout>
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
        source={cat?.pics ?? []}
        keySelector={(a) => a.url}
        each={(a) => <CatPic name={catName} url={a.url} />}
      />
    </>
  );
};

export default CatPage;

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const cats = await prisma.cat.findMany({
    select: {
      name: true,
    },
  });
  return {
    fallback: "blocking",
    paths: cats.map((cat) => ({
      params: {
        catName: cat.name,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<Params, Params> = async (ctx) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson,
  });

  const catName = ctx.params?.catName;

  if (!catName || !(await prisma.cat.findUnique({ where: { name: catName } })))
    return {
      notFound: true,
    };

  await ssg.fetchQuery("cats.getCatAssets", catName);

  return {
    props: {
      trpcState: ssg.dehydrate(),
      catName,
    },
  };
};
