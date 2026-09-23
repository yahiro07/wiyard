import { Icons } from "@/common/icons";
import { store } from "@/store/store";
import { cz } from "@lib/utils/cz";

export const GraphFloatUpButton = () => {
  const { graphAreaFloatUp } = store.useSnapshot();
  return (
    <button
      onClick={store.toggleGraphAreaFloatUp}
      className={cz(
        graphAreaFloatUp ? "opacity-100" : "opacity-50",
        "hover:opacity-80",
      )}
    >
      <Icons.StackForward size={30} />
    </button>
  );
};
