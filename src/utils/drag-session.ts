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
    onTap?(): void;
  },
  options?: {
    coordinate?: "relative" | "page" | "screen";
    tapDurationTh?: number;
    tapDistanceTh?: number;
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

  const startTime = Date.now();
  let lastPosition = originalPosition;
  let trackDistance = 0;

  const onDown = (e: PointerEvent) => {
    const position = getPointerPosition(e);
    callbacks.onDown?.({
      position,
      originalPosition,
    });
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerId !== e0.pointerId) return;
    const position = getPointerPosition(e);
    callbacks.onMove?.({
      position,
      originalPosition,
    });
    trackDistance += Math.hypot(
      position.x - lastPosition.x,
      position.y - lastPosition.y,
    );
    lastPosition = position;
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
    const endTime = Date.now();
    const duration = endTime - startTime;
    const durationTh = options?.tapDurationTh ?? 200;
    const distanceTh = options?.tapDistanceTh ?? 6;
    if (duration < durationTh && trackDistance < distanceTh) {
      callbacks.onTap?.();
    }
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
