import { Dropzone, IMAGE_MIME_TYPE, MIME_TYPES } from "@mantine/dropzone";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
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

  const acceptFiles = useCallback((files: File[]) => {
    console.log("Dropped Files", files);
    setFiles(files)
    // ... upload to cloudflare R2
  }, []);

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
    <>
      <Dropzone
        className={className}
        onDrop={acceptFiles}
        onReject={(rejection) => console.error("Files Rejected", rejection)}
        accept={ACCEPTED_MIME_TYPES}
        maxSize={8 * 1024 ** 2}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Dropzone.Accept>
            <IconUpload size={50} stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={50} stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={50} stroke={1.5} />
          </Dropzone.Idle>
          <div>{children}</div>
        </div>
      </Dropzone>
      <div style={{ padding: 10 }}>{previews}</div>
    </>
  );
}
