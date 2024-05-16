"use client";

import { addAsset } from "app/actions";

const ACCEPTABLE_MIME_TYPES = ["image/*", "video/mp4"];
const WORKER_ENDPOINT = process.env.NEXT_PUBLIC_WORKER_ENDPOINT;
const WORKER_ENDPOINT_SECRET = process.env.NEXT_PUBLIC_WORKER_ENDPOINT_AUTH_KEY;

export default function Upload() {
  const prefix = "Marceline";
  return (
    <>
      <label
        role="button"
        tabIndex={0}
        className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 transition active:scale-95 font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
      >
        Uplad Pics
        <input
          hidden
          type="file"
          required
          multiple
          accept={ACCEPTABLE_MIME_TYPES.join(",")}
          onChange={async (e) => {
            const files = Array.from(e.target.files!);

            const uploads = files.map((file) =>
              fetch(getAssetUrl(prefix, file), {
                method: "PUT",
                headers: {
                  "X-Custom-Auth-Key": WORKER_ENDPOINT_SECRET!,
                },
                body: file,
              })
                .then(async (res) => {
                  if (res.ok) return res.text();
                  throw new Error(await res.text());
                })
                .then(() => {
                  addAsset({
                    url: getAssetUrl(prefix, file),
                    isVideo: file.type.includes("video"),
                    catName: prefix,
                  });
                })
                .catch((e) => {
                  console.error(e);
                })
            );

            await Promise.all(uploads);
          }}
        />
      </label>
    </>
  );
}

function getAssetUrl(prefix: string, file: File) {
  return `${WORKER_ENDPOINT}${prefix}/${file.name}`;
}
