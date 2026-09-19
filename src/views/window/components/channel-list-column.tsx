import { Icons } from "@/common/icons";
import { cz } from "@lib/utils/cz";
import { twStyled } from "@lib/utils/tw-styled";

export const channelListColumnComponents = {
  ColumnFrame: twStyled.div(
    "w-50px bg-gray-700/60 flex-v gap-2 py-2 text-white pb-3",
  ),
  ChannelButton(props: { text: string; active: boolean; onClick: () => void }) {
    const { text, active, onClick } = props;
    return (
      <button
        type="button"
        className={cz(
          "w-40px h-30px bg-gray-300/50 flex-c text-white cursor-pointer",
          "font-bold text-sm",
          active && "!bg-#8ae/70",
        )}
        onClick={onClick}
      >
        {text}
      </button>
    );
  },
  AddButton(props: { onClick: () => void }) {
    const { onClick } = props;
    return (
      <button
        className="w-40px flex-c mt-1 cursor-pointer hover:opacity-80"
        type="button"
        onClick={onClick}
      >
        <Icons.Add size={20} />
      </button>
    );
  },
  DeleteButton(props: { onClick: () => void }) {
    const { onClick } = props;
    return (
      <button
        className="w-40px flex-c cursor-pointer hover:opacity-80"
        type="button"
        onClick={onClick}
      >
        <Icons.Trash size={18} />
      </button>
    );
  },
};
