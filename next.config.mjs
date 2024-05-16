/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [new URL(process.env.NEXT_PUBLIC_WORKER_ENDPOINT).hostname],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/wn19w3cc6lw8qiq5d6u9rhuy",
        permanent: true,
      },
    ];
  },
});
