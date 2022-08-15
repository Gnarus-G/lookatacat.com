import { useCallback, useState } from "react";

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);

  const uploadFiles = useCallback(async () => {
    await Promise.all(
      files.map((file) =>
        fetch(import.meta.env.PUBLIC_WORKER_ENDPOINT + file.name, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        }).catch((e) => console.error(e))
      )
    );
  }, [files]);

  const previews = files.map((file) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <div key={file.name} className="relative">
        <img
          src={imageUrl}
          className="w-full h-full rounded-lg"
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
        <p className="absolute bg-opacity-80 bg-gray-700 text-white bottom-0 right-0 w-full text-center">
          {[file.name, file.type, (file.size / 1024).toFixed(2) + " KB"].join(
            "; "
          )}
        </p>
      </div>
    );
  });

  return (
    <section className="flex flex-col text-[whitesmoke]">
      <div className="flex cursor-pointer border-2 rounded-sm border-dashed border-[#eeeeee] bg-[#4d4d4d] text-[#bdbdbd] outline-none hover:border-blue-600">
        <label
          className="flex items-center w-full h-44 justify-center text-center"
          htmlFor="upload"
        >
          Choose images or videos to upload...
        </label>
        <input
          id="upload"
          hidden
          type="file"
          multiple
          accept="image/*, video/mp4"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
      </div>
      <button
        className="p-3 mx-auto my-5 border-none bg-[#274988] bg-opacity-50 hover:bg-opacity-100 rounded-md cursor-pointer"
        type="button"
        onClick={uploadFiles}
      >
        Upload
      </button>
      <aside className="px-3">{previews}</aside>
    </section>
  );
}
