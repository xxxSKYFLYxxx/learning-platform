import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.AUTH_URL ?? "http://localhost:3002";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/admin", "/instructor", "/learn", "/api"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
