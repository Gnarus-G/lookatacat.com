/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_WORKER_ENDPOINT: string;
  readonly PUBLIC_WORKER_AUTH_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
