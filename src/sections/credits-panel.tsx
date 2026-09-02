import { useState } from "react";
import { catalog } from "@/base/showcase-entries";
import { Icons } from "@/components/icons";

type CreditInfo = {
  appName: string;
  imageUrl?: string;
  authorName: string;
  repositoryUrl: string;
  licenseType: string;
  forkedRepositoryUrl?: string;
  forkedAuthor?: string;
};

const CreditEntryCard = ({ info }: { info: CreditInfo }) => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);
  return (
    <div className="bg-gray-700 text-gray-300">
      <div className="flex-h px-2 gap-1 cursor-pointer" onClick={toggleOpen}>
        <div className="w-[90px] aspect-[1.5] h-[64px]">
          {info.imageUrl ? (
            <img
              src={info.imageUrl}
              alt={info.appName}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex-c bg-gray-500 text-xs text-gray-700">
              No Thumbnail
            </div>
          )}
        </div>
        <div className="grow">
          {!isOpen && (
            <div className="flex-v p-2">
              <div>{info.appName}</div>
              <div>{info.authorName}</div>
            </div>
          )}
          {isOpen && (
            <div className="flex-v p-2">
              <div>repository: {info.repositoryUrl}</div>
              <div>author: {info.authorName}</div>
              <div>license: {info.licenseType}</div>
              {false && info.forkedRepositoryUrl && (
                <div className="text-[#888]">
                  forked repository: {info.forkedRepositoryUrl}
                </div>
              )}
              {false && info.forkedAuthor && (
                <div className="text-[#888]">
                  forked author: {info.forkedAuthor}
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className="w-[30px] flex-c text-[20px] h-[64px]"
          style={{
            transform: isOpen ? "rotate(180deg)" : undefined,
            transition: "transform 0.3s",
          }}
        >
          <Icons.ChevronDown />
        </div>
      </div>
    </div>
  );
};

function createCreditEntryInfos(): CreditInfo[] {
  return Object.values(catalog).map((item) => {
    return {
      appName: item.name,
      imageUrl: item.originalPageUrl.startsWith("https://")
        ? item.originalPageUrl.replace("/index.html", "/unit-thumbnail.png")
        : undefined,
      authorName: "yamada",
      repositoryUrl: item.repositoryUrl,
      licenseType: "MIT",
      forkedRepositoryUrl: item.repositoryUrl,
      forkedAuthor: "tanaka",
    };
  });
}
const creditEntryInfos = createCreditEntryInfos();

export const CreditsPanel = () => {
  return (
    <div className="absolute-full flex-c bg-black/20">
      <div className="w-full max-w-[600px] max-h-[80%] overflow-y-auto bg-gray-800 text-white p-3">
        <div className="px-2 py-2 font-bold">Credits</div>
        <div className="flex-v gap-2 h-full overflow-y-auto bg-gray-800">
          {creditEntryInfos.map((info) => (
            <CreditEntryCard key={info.appName} info={info} />
          ))}
        </div>
      </div>
    </div>
  );
};
