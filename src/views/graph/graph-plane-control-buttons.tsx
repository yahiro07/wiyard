import { appEnvs } from "@/common/app-envs";
import { Icons } from "@/common/icons";
import { store } from "@/store/store";
import { graphPlaneHandlers } from "@/views/graph/graph-plane-handlers";

export const GraphPlaneControlButtons = () => {
  const { graphSpec } = store.useSnapshot();
  const buttonClass = "hover:opacity-80";
  return (
    <div className="absolute top-0 right-0 m-2">
      <div className="flex-ha gap-2">
        <div>
          <button
            className={buttonClass}
            onPointerDown={graphPlaneHandlers.handleMoveButtonPointerDown}
          >
            <Icons.Move size={20} />
          </button>
        </div>
        <div className="relative">
          <button
            className={buttonClass}
            onPointerDown={graphPlaneHandlers.handleScaleButtonPointerDown}
          >
            <Icons.Resize size={24} />
          </button>
          {appEnvs.isDevelopment && (
            <div className="absolute left-50% top-22px -translate-x-1/2 text-9px">
              {Math.round(graphSpec.contentScaling * 100)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
