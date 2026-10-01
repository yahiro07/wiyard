import { store } from "@/store/store";
import { cz } from "@lib/utils/cz";

export const DebugOverlay = () => {
  const { debugObject } = store.useSnapshot();
  if (!debugObject) return;
  return (
    <div
      className={cz(
        "absolute-full text-#0f0 pointer-events-none text-xs",
        "whitespace-pre-wrap",
      )}
    >
      {JSON.stringify(debugObject, null, 2)}
    </div>
  );
};
