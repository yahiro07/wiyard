import catalog from "../unit-inventories.json";

export { catalog };

export type CatalogKey = keyof typeof catalog;

export type ShowcaseEntry = {
  name: string;
  catalogKey: CatalogKey;
  thumbnailUrl?: string;
};

export const showcaseEntries: ShowcaseEntry[] = [
  ...Object.values(catalog)
    .filter((item) => item.originalPageUrl.startsWith("https://"))
    .map((item) => ({
      name: item.name,
      catalogKey: item.catalogKey as CatalogKey,
      thumbnailUrl: item.originalPageUrl.replace(
        "/index.html",
        "/unit-thumbnail.png",
      ),
    })),
  ...Object.values(catalog)
    .filter((item) => item.originalPageUrl.startsWith("file://"))
    .map((item) => ({
      name: item.name,
      catalogKey: item.catalogKey as CatalogKey,
    })),
];
