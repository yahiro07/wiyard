import { store } from "@/store/store";

export const CoordDebugLayer = () => {
  const { unitItems, portStuffs } = store.useSnapshot();
  return (
    <div className="pointer-events-none">
      <>
        {unitItems.map((item) => {
          if (item.type === "board" || item.type === "edge") {
            const pos = item.cardPosition;
            return (
              <div
                key={item.unitId}
                style={{ left: pos.x, top: pos.y }}
                className="absolute w-20px h-20px bd-#f08 -translate-x-1/2 -translate-y-1/2"
              />
            );
          }
          return null;
        })}
      </>
      <>
        {Object.values(portStuffs).map((item) => {
          const pos = item.position;
          return (
            <div
              key={item.portKey}
              style={{ left: pos.x, top: pos.y }}
              className="absolute w-20px h-20px bd-#0f0 -translate-x-1/2 -translate-y-1/2"
            />
          );
        })}
      </>
    </div>
  );
};
