export default function sitemap() {
  const base = "https://baharaz.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${base}/flash-sale`, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${base}/mall`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/categories`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];
}