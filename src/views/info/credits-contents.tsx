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

export const CreditsContents = () => {
  return (
    <div className="flex-v gap-4 bg-white p-2">
      {showcaseEntries.map((item) => (
        <CatalogItemView item={item} />
      ))}
    </div>
  );
};
