import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * OpenNext configuration for Cloudflare Workers.
 *
 * Prerendered program pages are served from the Worker's static assets. The
 * site has no incremental regeneration, so no R2 or KV cache is required.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
