import { Icons } from "@/common/icons";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { cz } from "@lib/utils/cz";

export const GraphFloatUpButton = () => {
  const { graphAreaElevated } = store.useSnapshot();
  return (
    <button
      onClick={actions.toggleGraphAreaElevated}
      className={cz(
        graphAreaElevated ? "opacity-100" : "opacity-50",
        "cursor-pointer hover:opacity-80",
      )}
    >
      <Icons.StackForward size={30} />
    </button>
  );
};
