import { Box } from "@mantine/core";
import Image from "next/image";
import React from "react";

export type CatAsset = {
  name: string;
  url: string;
  isVideo: boolean;
};

type CatProps = {
  onClick?: () => void;
} & CatAsset;

export default function Cat({ name, url, isVideo, onClick }: CatProps) {
  return (
    <>
      {isVideo ? (
        <Box
          component="video"
          src={url}
          autoPlay
          loop
          playsInline
          onClick={onClick}
        >
          <track kind="captions" />
        </Box>
      ) : (
        <Box
          component={Image}
          sx={(theme) => ({ borderRadius: theme.radius.lg })}
          onClick={onClick}
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
    </>
  );
}
