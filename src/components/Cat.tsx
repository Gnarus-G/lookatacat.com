import { Box } from "@mantine/core";
import Image from "next/image";
import React from "react";

type CatProps = {
  name?: string;
  url: string;
};

export default function CatPic({ name, url }: CatProps) {
  return (
    <Box
      component={Image}
      sx={(theme) => ({ borderRadius: theme.radius.lg })}
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
      }}
    >
      <track kind="captions" />
    </Box>
  );
}
