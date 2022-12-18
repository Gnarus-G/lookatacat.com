import { Box, ThemeIcon } from "@mantine/core";
import { IconHeart, IconTrash } from "@tabler/icons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { ReactNode, useCallback } from "react";
import { trpc } from "utils/trpc";

type CatProps = {
  name: string;
  url: string;
  isFave?: boolean;
};

export default function CatPic({ name, url, isFave }: CatProps) {
  const { mutate: fave } = trpc.proxy.cats.favoritePic.useMutation();
  const { mutate: trash } = trpc.proxy.cats.trashPic.useMutation();

  const favoriteThis = useCallback(() => {
    if (name && !isFave) fave({ url, catName: name });
  }, [fave, isFave, name, url]);

  const trashThis = useCallback(() => {
    trash(url);
  }, [trash, url]);

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        borderRadius: theme.radius.sm,
        overflow: "hidden",
        aspectRatio: "1/1",
        inset: 0,
        "&:hover > div": {
          opacity: 1,
        },
      })}
    >
      <Image
        src={url}
        style={{ objectFit: "cover" }}
        fill
        sizes="(max-width: 768px) 70vw, 250px, 750px"
        alt={name}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
      />
      <WhenCanManageCat name={name}>
        <>
          <ThemeIcon
            color={isFave ? "pink" : "dark"}
            radius="sm"
            p={4}
            m={5}
            sx={{
              position: "absolute",
              bottom: 0,
              cursor: isFave ? "not-allowed" : "pointer",
              opacity: isFave ? 0.5 : 0,
              transition: "opacity 200ms, background-color 200ms",
              "&:hover": {
                backgroundColor: isFave ? "darkred" : "#2e2e2e",
              },
            }}
            onClick={favoriteThis}
          >
            <IconHeart />
          </ThemeIcon>
          <ThemeIcon
            color="red"
            radius="sm"
            p={4}
            m={5}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              cursor: "pointer",
              opacity: 0,
              transition: "opacity 200ms, background-color 200ms",
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
            onClick={trashThis}
          >
            <IconTrash />
          </ThemeIcon>
        </>
      </WhenCanManageCat>
    </Box>
  );
}

export function CatVideo({ src }: { src: string }) {
  return (
    <Box
      component="video"
      src={src}
      autoPlay
      controls
      width="100%"
      loop
      playsInline
      sx={{
        objectFit: "cover",
        aspectRatio: "4/3",
        "&:fullscreen": {
          objectFit: "contain",
        },
        "&:-webkit-full-screen": {
          objectFit: "contain",
        },
      }}
    >
      <track kind="captions" />
    </Box>
  );
}

function WhenCanManageCat({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  const { data: owner } = trpc.proxy.cats.getOwner.useQuery(name);
  const session = useSession();
  if (
    session.status === "authenticated" &&
    owner?.id === session.data.user?.id
  ) {
    return <>{children}</>;
  }
  return null;
}
