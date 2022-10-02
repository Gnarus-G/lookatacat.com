import {
  Box,
  Button,
  Group,
  Image,
  Select,
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
import { useCallback, useState } from "react";
import { createFormInput, useForm } from "react-form-z";
import { env } from "../env/client.mjs";
import { trpc } from "../utils/trpc";

const ACCEPTABLE_MIME_TYPES = ["image/*", "video/mp4"];
const WORKER_ENDPOINT = env.NEXT_PUBLIC_WORKER_ENDPOINT;
const WORKER_ENDPOINT_SECRET = env.NEXT_PUBLIC_WORKER_ENDPOINT_AUTH_KEY;

const MantineInput = createFormInput(TextInput);

export default function FileUpload() {
  const theme = useMantineTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccesses, setUploadSuccesses] = useState<
    Record<string, boolean>
  >({});
  const [uploadErrors, setUploadErrors] = useState<
    Record<string, string | boolean>
  >({});
  const [files, setFiles] = useState<File[]>([]);
  const { mutate: addAsset } = trpc.proxy.cats.addAsset.useMutation();
  const catsQuery = trpc.proxy.cats.getOwnCats.useQuery();
  const myCats = catsQuery.data ?? [];

  const form = useForm({
    schema: (z) =>
      z.object({
        prefix: z
          .string()
          .refine(
            (p) => !!myCats.find((c) => c.name === p),
            "Must be one of your cats listed"
          ),
        secret: z
          .string()
          .refine(
            (s) => s === WORKER_ENDPOINT_SECRET,
            "Psych! That's the wrong number!"
          ),
      }),
    initial: { prefix: "", secret: "" },
  });

  const submitForm = form.onSubmit(
    useCallback(
      async (data) => {
        setUploading(true);

        const uploads = files.map((file) =>
          fetch(getAssetUrl(data.prefix, file), {
            method: "PUT",
            headers: {
              "X-Custom-Auth-Key": data.secret,
            },
            body: file,
          })
            .then(async (res) => {
              if (res.ok) return res.text();
              throw new Error(await res.text());
            })
            .then(() => {
              setUploadSuccesses((m) => ({ ...m, [file.name]: true }));
              addAsset({
                url: getAssetUrl(data.prefix, file),
                isVideo: file.type.includes("video"),
                catName: data.prefix,
              });
            })
            .catch((e) => {
              console.error(e);
              setUploadErrors((er) => ({
                ...er,
                [file.name]: e.message || true,
              }));
            })
        );
        await Promise.all(uploads);

        setUploading(false);
      },
      [addAsset, files]
    )
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
            loop
            style={{
              objectFit: "cover",
              width: "100%",
              aspectRatio: "9/12",
              borderRadius: 4,
            }}
          />
        ) : (
          <Image
            src={fileUrl}
            alt={file.name}
            radius="sm"
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
        <Select
          label="Cat"
          placeholder="Pick a cat"
          onChange={(v) => v && form.setData((d) => ({ ...d, prefix: v }))}
          data={myCats.map((c) => ({ value: c.name, label: c.name }))}
          value={form.data.prefix}
          error={form.errors.prefix}
          withAsterisk
        />
        <MantineInput
          label="Secret"
          type="password"
          for={[form, "secret"]}
          withAsterisk
        />
        <Dropzone onDrop={setFiles} accept={ACCEPTABLE_MIME_TYPES}>
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
          loading={uploading}
          type="submit"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
        <SimpleGrid cols={2} px="lg" sx={{ overflowY: "auto", maxHeight: 400 }}>
          {previews}
        </SimpleGrid>
      </Stack>
    </form>
  );
}

function getAssetUrl(prefix: string, file: File) {
  return `${WORKER_ENDPOINT}${prefix}/${file.name}`;
}
