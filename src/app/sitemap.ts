import type { MetadataRoute } from "next";

const baseUrl = "https://kevinfrey.com";
const anchors = ["#manifesto", "#credits", "#television", "#leadership", "#work", "#contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: baseUrl, lastModified: now },
    ...anchors.map((anchor) => ({ url: `${baseUrl}/${anchor}`, lastModified: now })),
  ];
}
