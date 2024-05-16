"use client";
import { deletePicture } from "app/actions";
import { CatPic } from "drizzle/schema";
import Image from "next/image";
import React, { useRef } from "react";

export default function Picture(
  props: typeof CatPic.$inferSelect & { catName: string }
) {
  const ref = useRef<HTMLDialogElement>(null);
  const deleteConfirmRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <article
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
      </article>
      <dialog
        ref={ref}
        className="w-full h-full lg:w-1/2 rounded-lg backdrop:bg-slate-800 backdrop:bg-opacity-90 bg-slate-600 text-white"
      >
        <div className="relative h-full flex flex-col">
          <h1 className="sticky">
            uploaded {new Date(props.createdAt).toLocaleString(undefined)}
          </h1>
          <div className="relative w-full aspect-square my-auto">
            <Image
              className="object-contain"
              src={props.url}
              alt="Nuri"
              fill
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tLevBwACiAEwoxWwqwAAAABJRU5ErkJggg=="
            />
          </div>
          <div className="sticky mt-auto bottom-0 right-0 px-5 py-2">
            <button
              className="float-left text-red-300"
              onClick={() => deleteConfirmRef.current?.show()}
            >
              Delete Picture
            </button>
            <dialog
              ref={deleteConfirmRef}
              className="bg-slate-400 text-white border-slate-500 border-solid border-2 bottom-[100%] rounded-lg"
            >
              <p>Are you sure?</p>
              <div className="flex gap-20 mt-5">
                <button
                  className="float-left"
                  onClick={() => deleteConfirmRef.current?.close()}
                >
                  No
                </button>
                <button
                  className="float-right text-red-600"
                  onClick={() => deletePicture(props.id, props.url)}
                >
                  Yes, Delete!
                </button>
              </div>
            </dialog>
            <button
              className="float-right"
              onClick={() => ref.current?.close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
