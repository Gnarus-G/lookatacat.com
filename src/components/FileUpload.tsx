import { useCallback, useState } from "react";

export default function FileUpload() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<Record<string, string>>({});
  const [error, setError] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);

  const uploadFiles = useCallback(async () => {
    setLoading(true);
    const uploads = files.map((file) =>
      fetch(import.meta.env.PUBLIC_WORKER_ENDPOINT + file.name, {
        method: "PUT",
        body: file,
      })
        .then((res) => res.text())
        .then((msg) => setSuccess((m) => ({ ...m, [file.name]: msg })))
        .catch((e) => {
          console.error(e);
          setError((e) => ({ ...e, [file.name]: e.message }));
        })
    );
    await Promise.all(uploads);
    setLoading(false);
  }, [files]);

  const previews = files.map((file) => {
    const fileUrl = URL.createObjectURL(file);
    const isVideo = file.type.includes("video");

    return (
      <div key={file.name} className="relative self-baseline">
        {isVideo ? (
          <video
            className="w-full h-full rounded-lg"
            src={fileUrl}
            autoPlay
            playsInline
            onLoad={() => URL.revokeObjectURL(fileUrl)}
            loop
          />
        ) : (
          <img
            className="w-full h-full rounded-lg object-cover"
            src={fileUrl}
            onLoad={() => URL.revokeObjectURL(fileUrl)}
          />
        )}
        <p
          className="absolute bg-opacity-80 bg-gray-700 rounded-t-lg text-white top-0 w-full text-center truncate"
          style={{
            backgroundColor: success[file.name]
              ? "green"
              : error[file.name]
              ? "red"
              : undefined,
          }}
        >
          {success[file.name] || error[file.name] || file.name}
        </p>
        <p className="absolute bg-opacity-80 bg-gray-700 rounded-b-lg text-white bottom-0 w-full text-center">
          {[file.type, (file.size / 1024).toFixed(2) + " KB"].join("; ")}
        </p>
      </div>
    );
  });

  return (
    <section className="flex flex-col text-[whitesmoke]">
      <div className="flex border-2 rounded-sm border-dashed border-[#eeeeee] bg-[#4d4d4d] text-[#bdbdbd] outline-none hover:border-blue-600">
        <label
          className="flex items-center w-full h-44 justify-center text-center cursor-pointer"
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
        className="p-3 mx-auto my-5 border-none bg-[#274988] bg-opacity-50 hover:bg-opacity-100 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-700"
        type="button"
        disabled={loading}
        onClick={uploadFiles}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      <aside className="px-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 text-xs md:text-sm lg:text-base">
        {previews}
      </aside>
    </section>
  );
}
