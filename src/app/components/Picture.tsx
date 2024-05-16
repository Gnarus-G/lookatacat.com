"use client";
import { deletePicture } from "app/actions";
import { CatPic } from "drizzle/schema";
import Image from "next/image";
import React, { useRef } from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function Picture(
  props: typeof CatPic.$inferSelect & { catName: string }
) {
  const ref = useRef<HTMLDialogElement>(null);
  const deleteConfirmRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  return (
    <>
      <figure
        className="relative aspect-square"
        role="button"
        tabIndex={0}
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            ref.current?.showModal();
          }
        }}
        onClick={() => ref.current?.showModal()}
      >
        <Image
          className="object-cover rounded"
          src={props.url}
          alt="Nuri"
          fill
          sizes="(max-width: 768px) 90vw, 300px"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
        />
      </figure>
      <dialog
        ref={ref}
        className="w-full h-full lg:w-1/2 rounded-lg backdrop:bg-slate-800 backdrop:bg-opacity-90 bg-slate-600 text-white"
      >
        <figure className="relative h-full p-5 flex flex-col">
          <figcaption className="sticky top-0">
            <h1 className="text-slate-300">
              uploaded {new Date(props.createdAt).toLocaleString(undefined)}
            </h1>
          </figcaption>
          <div className="relative w-full h-full my-auto">
            <Image
              className="object-contain"
              src={props.url}
              alt="Nuri"
              fill
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
            />
          </div>
          <div className="sticky mt-auto bottom-0 right-0 pb-2">
            <Button
              className="float-left bg-red-600 hover:bg-red-700"
              onClick={() => deleteConfirmRef.current?.show()}
            >
              Delete Picture
            </Button>
            <dialog
              ref={deleteConfirmRef}
              className="p-5 bg-slate-400 text-black border-slate-500 border-solid border-2 bottom-[100%] rounded-lg"
            >
              <p>Are you sure?</p>
              <div className="flex gap-20 mt-5">
                <Button
                  className="float-left bg-blue-400 hover:bg-blue-300"
                  onClick={() => deleteConfirmRef.current?.close()}
                >
                  No
                </Button>
                <Button
                  className="float-right bg-red-300 hover:bg-red-200"
                  onClick={async () => {
                    await deletePicture(props.id, props.url);
                    router.refresh();
                  }}
                >
                  Yes, Delete!
                </Button>
              </div>
            </dialog>
            <Button
              className="float-right"
              onClick={() => ref.current?.close()}
            >
              Close
            </Button>
          </div>
        </figure>
      </dialog>
    </>
  );
}
