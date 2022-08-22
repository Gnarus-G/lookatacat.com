import { Box } from "@mantine/core";
import Image from "next/image";
import React from "react";

type CatProps = {
  name?: string;
  url: string;
  isVideo?: boolean;
};

export default function Cat({ name, url, isVideo }: CatProps) {
  return (
    <>
      {isVideo ? (
        <Box
          component="video"
          sx={(theme) => ({ borderRadius: theme.radius.lg, maxHeight: 735 })}
          src={url}
          autoPlay
          width="100%"
          height="100%"
          loop
          playsInline
        >
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
          alt={name}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
        />
      )}
    </>
  );
}
