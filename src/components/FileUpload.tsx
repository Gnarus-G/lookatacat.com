import { Dropzone, IMAGE_MIME_TYPE, MIME_TYPES } from "@mantine/dropzone";
import { InsertPhoto } from "@mui/icons-material";
import { ReactNode, useCallback, useState } from "react";

const ACCEPTED_MIME_TYPES = [...IMAGE_MIME_TYPE, MIME_TYPES.mp4];

export default function FileUpload({
  className,
  children,
}: {
  children: ReactNode;
  className?: string;
}) {
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
      <img
        key={file.name}
        src={imageUrl}
        width="100%"
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Dropzone
        className={className}
        onDrop={setFiles}
        onReject={(rejection) => console.error("Files Rejected", rejection)}
        accept={ACCEPTED_MIME_TYPES}
        maxSize={8 * 1024 ** 2}
        styles={{
          root: {
            backgroundColor: "#4d4d4d",
            color: "whitesmoke",
            ":hover": {
              color: "black",
            },
          },
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Dropzone.Idle>
            <InsertPhoto style={{ width: 50, height: 50 }} />
          </Dropzone.Idle>
          <div>{children}</div>
        </div>
      </Dropzone>
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
      <div style={{ padding: "0 10px" }}>{previews}</div>
    </div>
  );
}
