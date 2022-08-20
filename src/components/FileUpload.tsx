import {
  Box,
  Button,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import {
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons";
import { FormEvent, useCallback, useState } from "react";

export default function FileUpload({ baseAssetUrl }: { baseAssetUrl: string }) {
  const ACCEPTABLE_MIME_TYPES = ["image/*", "video/mp4"];
  const theme = useMantineTheme();

  const [uploadLoading, setUploadingLoading] = useState(false);
  const [uploadSuccesses, setUploadSuccesses] = useState<
    Record<string, string>
  >({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [prefix, setPrefix] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const uploadFiles = useCallback(async () => {
    setUploadingLoading(true);
    const uploads = files.map((file) =>
      fetch(`${baseAssetUrl}${prefix}/${file.name}`, {
        method: "PUT",
        body: file,
      })
        .then((res) => res.text())
        .then((msg) => setUploadSuccesses((m) => ({ ...m, [file.name]: msg })))
        .catch((e) => {
          console.error(e);
          setUploadErrors((er) => ({ ...er, [file.name]: er.message ?? "" }));
        })
    );
    await Promise.all(uploads);
    setUploadingLoading(false);
  }, [baseAssetUrl, files, prefix]);

  const submitForm = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      uploadFiles();
    },
    [uploadFiles]
  );

  const previews = files.map((file) => {
    const fileUrl = URL.createObjectURL(file);
    const isVideo = file.type.includes("video");

    return (
      <Box sx={{ position: "relative" }} key={file.name}>
        {isVideo ? (
          <video
            src={fileUrl}
            autoPlay
            playsInline
            onLoad={() => URL.revokeObjectURL(fileUrl)}
            loop
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <Image
            src={fileUrl}
            alt={file.name}
            onLoad={() => URL.revokeObjectURL(fileUrl)}
            radius="md"
            caption={[file.type, (file.size / 1024).toFixed(2) + " KB"].join(
              "; "
            )}
          />
        )}
        <ThemeIcon
          radius="xl"
          size="lg"
          variant="light"
          color={
            uploadSuccesses[file.name]
              ? "teal"
              : uploadErrors[file.name]
              ? "red"
              : undefined
          }
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          {uploadSuccesses[file.name] ? (
            <IconCircleCheck />
          ) : uploadErrors[file.name] ? (
            <IconCircleX />
          ) : (
            <IconCircleDashed />
          )}
        </ThemeIcon>
      </Box>
    );
  });

  return (
    <form onSubmit={submitForm}>
      <Stack py="sm">
        <TextInput
          label="Prefix"
          placeholder="name of the cat (presumably)"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          withAsterisk
        />
        <Dropzone
          onDrop={setFiles}
          maxSize={8 * 1024 ** 2}
          accept={ACCEPTABLE_MIME_TYPES}
        >
          <Group
            position="center"
            spacing="xs"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload size={50} stroke={1.5} color={theme.colors.blue[4]} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} stroke={1.5} color={theme.colors.red[4]} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag images/videos here or click to select files
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed
                8mb
              </Text>
            </div>
          </Group>
        </Dropzone>
        <Button
          loading={uploadLoading}
          type="submit"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
        >
          {uploadLoading ? "Uploading..." : "Upload"}
        </Button>
        <SimpleGrid cols={2} px="lg" sx={{ overflowY: "auto", maxHeight: 400 }}>
          {previews}
        </SimpleGrid>
      </Stack>
    </form>
  );
}
