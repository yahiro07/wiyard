import { Icons } from "@/common/icons";
import { showcaseEntries } from "@/domain/showcase-entries";
import { CatalogItem } from "@/domain/unit-entries";

const CatalogItemView = ({ item }: { item: CatalogItem }) => {
  const headerClass = "w-55px";

  return (
    <div className="text-sm flex-v gap-0">
      <div className="flex-ha gap-1">
        <div className="w-36px h-20px">
          <img src={item.thumbnailUrl} className="w-full h-full object-cover" />
        </div>
        <div>{item.name}</div>
      </div>
      <div className="flex-ha gap-1">
        <div className={headerClass}>Original:</div>
        <a
          href={item.originalRepositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icons.Github size={15} />
        </a>
        <div>{item.originalAuthor}</div>
      </div>
      {item.forkedRepositoryUrl && (
        <div className="flex-ha gap-1">
          <div className={headerClass}>Forked:</div>
          <a
            href={item.forkedRepositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icons.Github size={15} />
          </a>
          <div>{item.forkedAuthor}</div>
        </div>
      )}
      <div className="flex-ha gap-1">
        <div className={headerClass}>License:</div>
        <div>{item.license}</div>
        {item.licenseTextUrl && (
          <a
            href={item.licenseTextUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icons.Document size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

type WallpaperItem = {
  imageUrl: string;
  linkUrl: string;
  linkText: string;
};

const wallpaperItems: WallpaperItem[] = [
  {
    imageUrl: "/images/bg1.avif",
    linkUrl:
      "https://www.vecteezy.com/photo/1959731-green-hill-under-clear-blue-sky",
    linkText: "Vecteezy",
  },
];

const WallpaperItemView = ({ item }: { item: WallpaperItem }) => {
  return (
    <div className="flex-ha gap-1">
      <div className="w-34px h-20px">
        <img src={item.imageUrl} className="w-full h-full object-cover" />
      </div>
      <a
        href={item.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm"
      >
        {item.linkText}
      </a>
    </div>
  );
};

export const CreditsContents = () => {
  return (
    <div className="flex-v gap-4 bg-white p-2">
      <h3 className="-mb-2">Plugin Units</h3>
      {showcaseEntries.map((item, i) => (
        <CatalogItemView key={i} item={item} />
      ))}
      <h3 className="-mb-2">Wallpapers</h3>
      {wallpaperItems.map((item, i) => (
        <WallpaperItemView key={i} item={item} />
      ))}
    </div>
  );
};
