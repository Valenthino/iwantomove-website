import type { Metadata } from "next";
export const site = "https://iwantomove.ca";
export function metadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${site}${path}` },
    openGraph: {
      title,
      description,
      url: `${site}${path}`,
      siteName: "IWantToMove.ca",
      locale: "en_CA",
      type: "website",
      images: [{ url: `${site}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${site}/opengraph-image`],
    },
  };
}
