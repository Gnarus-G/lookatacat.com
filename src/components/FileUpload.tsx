import { useDropzone } from "react-dropzone";
import { CSSProperties, ReactNode, useCallback, useMemo } from "react";

const baseStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#4d4d4d",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function FileUpload({ children }: { children: ReactNode }) {
  const {
    acceptedFiles: files,
    getRootProps,
    getInputProps,
    isDragAccept,
    isFocused,
    isDragReject,
  } = useDropzone({
    multiple: true,
    maxSize: 8 * 1024 ** 2,
    onDropRejected: (rejection: any) =>
      console.error("Files Rejected", rejection),
    accept: {
      "image/*": [],
      "video/mp4": [],
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

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
      <img
        key={file.name}
        src={imageUrl}
        width="100%"
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    );
  });

  return (
    <section
      style={{ display: "flex", flexDirection: "column", color: "whitesmoke" }}
    >
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <div>{children}</div>
      </div>
      <button
        style={{
          padding: 10,
          margin: "10px auto",
          border: "none",
          backgroundColor: "#274988",
          color: "whitesmoke",
          borderRadius: 5,
          cursor: "pointer",
        }}
        type="button"
        onClick={uploadFiles}
      >
        Upload
      </button>
      <aside style={{ padding: "0 10px" }}>{previews}</aside>
    </section>
  );
}
