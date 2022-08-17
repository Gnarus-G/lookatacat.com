/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  catBucket: R2Bucket;

  // Vars
  WEB_ORIGIN: string;

  // Secrets
  AUTH_KEY_SECRET: string;
}

type WorkerFunction<R = void> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => R;

const catCrud: WorkerFunction<Promise<Response>> = async (request, env) => {
  const url = new URL(request.url);
  const key = url.pathname.slice(1);

  switch (request.method) {
    case "PUT":
      await env.catBucket.put(key, request.body);
      return new Response(`Successfully uploaded ${key}!`);
    case "GET":
      if (!key) {
        //get all assets
        const allObjects = await env.catBucket.list({
          include: ["httpMetadata"],
        });

        const assets = allObjects.objects.map((o) => ({
          path: o.key,
          type: o.httpMetadata.contentType,
          uploadedAt: o.uploaded,
        }));

        return new Response(
          JSON.stringify({
            assets,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const object = await env.catBucket.get(key);

      if (object === null) {
        return new Response("Object Not Found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);

      return new Response(object.body, {
        headers,
      });
    case "DELETE":
      await env.catBucket.delete(key);
      return new Response("Deleted!");

    default:
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          Allow: "PUT, GET, DELETE",
        },
      });
  }
};

// Check requests for a pre-shared secret
const hasValidHeader: WorkerFunction<boolean> = (request, env) => {
  // return request.headers.get("X-Custom-Auth-Key") === env.AUTH_KEY_SECRET;
  return true;
};

const authorizeRequest: WorkerFunction<boolean> = (request, env, ctx) => {
  switch (request.method) {
    case "PUT":
    case "DELETE":
      return hasValidHeader(request, env, ctx);
    case "GET":
      return true;
    default:
      return false;
  }
};

const getCorsOrigin: WorkerFunction<{}> = (req, env) => {
  if (env.WEB_ORIGIN === "*") {
    return {
      "Access-Control-Allow-Origin": "*",
    };
  }

  const origin = req.headers.get("origin");
  const isAllowedOrigin = origin && env.WEB_ORIGIN.split(",").includes(origin);

  if (!isAllowedOrigin) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin",
  };
};

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      ...getCorsOrigin(request, env, ctx),
      "Access-Control-Allow-Methods": "PUT, GET, DELETE",
      "Access-Control-Allow-Headers": "*",
    };

    console.log("CORS", "headers", corsHeaders);

    if (request.method === "OPTIONS") {
      return new Response("God speed!", {
        headers: corsHeaders,
      });
    }

    if (!authorizeRequest(request, env, ctx)) {
      return new Response("Forbidden", {
        status: 403,
        headers: corsHeaders,
      });
    }

    const response = await catCrud(request, env, ctx);
    Object.entries(corsHeaders).forEach(([header, value]) =>
      response.headers.append(header, value)
    );
    return response;
  },
} as {
  fetch: WorkerFunction<Promise<Response>>;
};
