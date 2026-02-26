const CDN_BASE_URL = "https://d1dnclb6k05rdk.cloudfront.net";

/**
 * Returns a full CDN URL for assets that were moved off the local `public` directory.
 */
export const cdnUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, "");
  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const CDN_BASE = CDN_BASE_URL;
