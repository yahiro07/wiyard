export type Point = { x: number; y: number };

export type DragHandlerEvent = {
  position: Point;
  originalPosition: Point;
};
export function startDragSession(
  e0: PointerEvent,
  callbacks: {
    onDown?(e: DragHandlerEvent): void;
    onMove?(e: DragHandlerEvent): void;
    onUp?(e: DragHandlerEvent): void;
    onCancel?(e: DragHandlerEvent): void;
    onUpOrCancel?(e: DragHandlerEvent): void;
  },
  options?: {
    coordinate?: "relative" | "page" | "screen";
  },
) {
  const el = e0.currentTarget as HTMLDivElement;

  const coordinate = options?.coordinate ?? "page";
  const win = e0.view ?? window;
  const elementRect =
    coordinate === "relative" ? el.getBoundingClientRect() : undefined;

  const getPointerPosition = (e: PointerEvent): Point => {
    switch (coordinate) {
      case "relative": {
        return {
          x: e.clientX - (elementRect?.left ?? 0),
          y: e.clientY - (elementRect?.top ?? 0),
        };
      }
      case "page":
        return { x: e.clientX, y: e.clientY };
      case "screen":
        return { x: e.screenX, y: e.screenY };
    }
  };

  const originalPosition = getPointerPosition(e0);

  const onDown = (e: PointerEvent) => {
    const position = getPointerPosition(e);
    callbacks.onDown?.({
      position,
      originalPosition,
    });
  };
  const onMove = (e: PointerEvent) => {
    const position = getPointerPosition(e);
    callbacks.onMove?.({
      position,
      originalPosition,
    });
  };
  const cleanup = () => {
    try {
      el.releasePointerCapture(e0.pointerId);
    } catch {
      // ignore
    }
    win.removeEventListener("pointermove", onMove);
    win.removeEventListener("pointerup", onPointerUp);
    win.removeEventListener("pointercancel", onPointerCancel);
  };
  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== e0.pointerId) {
      return;
    }
    callbacks.onUp?.({
      position: getPointerPosition(e),
      originalPosition,
    });
    callbacks.onUpOrCancel?.({
      position: getPointerPosition(e),
      originalPosition,
    });
    cleanup();
  };
  const onPointerCancel = (e: PointerEvent) => {
    if (e.pointerId !== e0.pointerId) {
      return;
    }
    callbacks.onCancel?.({
      position: getPointerPosition(e),
      originalPosition,
    });
    callbacks.onUpOrCancel?.({
      position: getPointerPosition(e),
      originalPosition,
    });
    cleanup();
  };

  win.addEventListener("pointermove", onMove);
  win.addEventListener("pointerup", onPointerUp);
  win.addEventListener("pointercancel", onPointerCancel);
  try {
    el.setPointerCapture(e0.pointerId);
  } catch {
    // ignore
  }
  onDown(e0);
}
