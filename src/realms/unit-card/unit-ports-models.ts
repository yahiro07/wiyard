import { actions } from "@/store/actions";
import { startDragSession } from "@/utils/drag-session";

export const handlePortPointerDown = (
  e0: React.PointerEvent<HTMLDivElement>,
  portKey: string,
) => {
  actions.setDraggingPortKey(portKey);

  startDragSession(e0.nativeEvent, {
    onUpOrCancel(e) {
      actions.setDraggingPortKey(null);
    },
  });
};
