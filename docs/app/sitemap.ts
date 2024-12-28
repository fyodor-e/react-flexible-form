import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://fyodor-e.github.io/react-flexible-form/",
      lastModified: new Date(),
    },
    {
      url: "https://fyodor-e.github.io/react-flexible-form/docs/getting-started",
      lastModified: new Date(),
    },
    {
      url: "https://fyodor-e.github.io/react-flexible-form/docs/typescript",
      lastModified: new Date(),
    },
    {
      url: "https://fyodor-e.github.io/react-flexible-form/api/useForm",
      lastModified: new Date(),
    },
    {
      url: "https://fyodor-e.github.io/react-flexible-form/api/Field",
      lastModified: new Date(),
    },
    {
      url: "https://fyodor-e.github.io/react-flexible-form/api/useFieldArray",
      lastModified: new Date(),
    },
    {
      url: "https://fyodor-e.github.io/react-flexible-form/api/useSubform",
      lastModified: new Date(),
    },
    {
      url: "https://fyodor-e.github.io/react-flexible-form/api/useConvert",
      lastModified: new Date(),
    },
    {
      url: "https://fyodor-e.github.io/react-flexible-form/api/utils",
      lastModified: new Date(),
    },
  ];
}
