import { useStoreAccess } from "../../root/app-context";

export const DebugOverlay = () => {
  const [{ debugObject }] = useStoreAccess();
  if (!debugObject) return null;
  return (
    <div className="absolute top-0 left-0 pointer-events-none">
      <div className="whitespace-pre-wrap text-xs text-#0f0 p-2">
        {JSON.stringify(debugObject, null, 2)}
      </div>
    </div>
  );
};
