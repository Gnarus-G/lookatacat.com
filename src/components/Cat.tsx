import { Box, ThemeIcon } from "@mantine/core";
import { IconHeart, IconTrash } from "@tabler/icons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useCallback } from "react";
import { trpc } from "utils/trpc";

type CatProps = {
  name?: string;
  url: string;
};

export default function CatPic({ name, url }: CatProps) {
  const session = useSession();
  const { mutate: fave } = trpc.proxy.cats.favoritePic.useMutation();
  const { mutate: trash } = trpc.proxy.cats.trashPic.useMutation();

  const favoriteThis = useCallback(() => {
    if (name) fave({ url, catName: name });
  }, [fave, name, url]);

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        borderRadius: theme.radius.sm,
        overflow: "hidden",
      })}
    >
      <Image
        src={url}
        loading="lazy"
        objectFit="cover"
        width="100%"
        height="100%"
        layout="responsive"
        alt={name}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
      />
      {session.status === "authenticated" && (
        <ThemeIcon
          color="pink"
          radius="xl"
          m={5}
          sx={(theme) => ({
            position: "absolute",
            bottom: 0,
            cursor: "pointer",
            "&:hover": {
              backgroundImage: theme.fn.gradient({
                from: "pink",
                to: "red",
                deg: 45,
              }),
            },
          })}
          onClick={favoriteThis}
        >
          <IconHeart />
        </ThemeIcon>
      )}
      {session.status === "authenticated" && (
        <ThemeIcon
          color="red"
          radius="xl"
          m={5}
          sx={(theme) => ({
            position: "absolute",
            bottom: 0,
            right: 0,
            cursor: "pointer",
            "&:hover": {
              backgroundImage: theme.fn.gradient({
                from: "red",
                to: "pink",
                deg: 45,
              }),
            },
          })}
          onClick={() => trash(url)}
        >
          <IconTrash />
        </ThemeIcon>
      )}
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
