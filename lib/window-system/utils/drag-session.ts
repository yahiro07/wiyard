import { Point, Vector } from "./common-types";

//----------

type DragSessionCallbacks = {
  onMove?(pos: Point, relativeMoveAmountFromStart: Vector): void;
  onEnd?(cause: "end" | "cancel"): void;
};

type DragSession = {
  startPosition: Point;
  run(callbacks: DragSessionCallbacks): void;
};

type DragSessionOptions = {
  //if provided, pos will be relative to this element,
  //otherwise pos will be relative to currentTarget of the initiated pointer event
  coordinateBaseElement?: HTMLElement;
};

export function createDragSession(
  inputEvent: PointerEvent | React.PointerEvent,
  options?: DragSessionOptions,
): DragSession {
  const e0 = "nativeEvent" in inputEvent ? inputEvent.nativeEvent : inputEvent;

  const baseEl =
    options?.coordinateBaseElement ?? (e0.currentTarget as HTMLElement);
  const baseRect = baseEl.getBoundingClientRect();
  const baseSx = baseRect.width / (baseEl.offsetWidth || 1);
  const baseSy = baseRect.height / (baseEl.offsetHeight || 1);

  const getPos = (e: PointerEvent): Point => {
    return {
      x: (e.clientX - baseRect.left) / baseSx,
      y: (e.clientY - baseRect.top) / baseSy,
    };
  };
  const startPosition = getPos(e0);
  return {
    startPosition,
    run(callbacks) {
      startPointerCaptureSession(e0, {
        onMove(e) {
          const pos = getPos(e);
          const relativeMoveAmountFromStart = {
            x: pos.x - startPosition.x,
            y: pos.y - startPosition.y,
          };
          callbacks.onMove?.(pos, relativeMoveAmountFromStart);
        },
        onUpOrCancel(_, cause) {
          callbacks.onEnd?.(cause === "up" ? "end" : "cancel");
        },
      });
    },
  };
}

export function startDragSession(
  e0: PointerEvent | React.PointerEvent,
  callbacks: DragSessionCallbacks,
  options?: DragSessionOptions,
) {
  createDragSession(e0, options).run(callbacks);
}

//----------

type DragSessionCallbacksEx = {
  onStart?(): void;
  onMove?(pos: Point, relativeMoveAmountFromStart: Vector): void;
  onUp?(pos: Point): void;
  onTap?(): void;
  onCancel?(): void;
  onEnd?(pos: Point): void; //called after either up/tap/cancel
};

type DragSessionEx = {
  startPosition: Point;
  run(callbacks: DragSessionCallbacksEx): void;
};

type DragSessionExOptions = {
  //if provided, pos will be relative to this element,
  //otherwise pos will be relative to currentTarget of the initiated pointer event
  coordinateBaseElement?: HTMLElement;
  tapDurationTh?: number;
  tapDistanceTh?: number;
};

//onStart is called after either
//--tapDurationTh elapsed
//OR
//--track distance exceeds tapDistanceTh
export function createDragSessionEx(
  inputEvent: PointerEvent | React.PointerEvent,
  options?: DragSessionExOptions,
): DragSessionEx {
  const tapDurationTh = options?.tapDurationTh ?? 200;
  const tapDistanceTh = options?.tapDistanceTh ?? 10;

  const e0 = "nativeEvent" in inputEvent ? inputEvent.nativeEvent : inputEvent;

  const baseEl =
    options?.coordinateBaseElement ?? (e0.currentTarget as HTMLElement);
  const baseRect = baseEl.getBoundingClientRect();
  const baseSx = baseRect.width / (baseEl.offsetWidth || 1);
  const baseSy = baseRect.height / (baseEl.offsetHeight || 1);

  const getPos = (e: PointerEvent): Point => {
    return {
      x: (e.clientX - baseRect.left) / baseSx,
      y: (e.clientY - baseRect.top) / baseSy,
    };
  };
  const startPosition = getPos(e0);

  let timerId: NodeJS.Timeout | undefined;
  let started = false;
  let latestPosition = startPosition;

  return {
    startPosition,
    run(callbacks) {
      const callMove = (pos: Point) => {
        const relativeMoveAmountFromStart = {
          x: pos.x - startPosition.x,
          y: pos.y - startPosition.y,
        };
        callbacks.onMove?.(pos, relativeMoveAmountFromStart);
      };
      const triggerStart = (pos: Point) => {
        if (!started) {
          callbacks.onStart?.();
          callMove(pos);
          started = true;
        }
      };
      const cancelTimer = () => {
        if (timerId) {
          clearTimeout(timerId);
          timerId = undefined;
        }
      };
      timerId = setTimeout(() => triggerStart(latestPosition), tapDurationTh);

      startPointerCaptureSession(e0, {
        onMove(e) {
          const pos = getPos(e);
          if (!started) {
            const distFromStart = Math.hypot(
              pos.x - startPosition.x,
              pos.y - startPosition.y,
            );
            if (distFromStart > tapDistanceTh) {
              triggerStart(pos);
              cancelTimer();
            }
          } else {
            callMove(pos);
          }
          latestPosition = pos;
        },
        onUpOrCancel(e, cause) {
          const pos = getPos(e);
          if (cause === "up") {
            if (started) {
              callbacks.onUp?.(pos);
            } else {
              callbacks.onTap?.();
            }
          } else {
            if (started) {
              callbacks.onCancel?.();
            }
          }
          callbacks.onEnd?.(pos);
          cancelTimer();
        },
      });
    },
  };
}

export function startDragSessionEx(
  e0: PointerEvent | React.PointerEvent,
  callbacks: DragSessionCallbacksEx,
  options?: DragSessionExOptions,
) {
  createDragSessionEx(e0, options).run(callbacks);
}

//----------

type PointerCaptureSessionCallbacks = {
  onMove?(e: PointerEvent): void;
  onUpOrCancel?(e: PointerEvent, cause: "up" | "cancel"): void;
};

function startPointerCaptureSession(
  e0: PointerEvent,
  callbacks: PointerCaptureSessionCallbacks,
) {
  const el = e0.currentTarget as HTMLDivElement;
  const win = e0.view ?? window;

  const self = {
    onMove(e: PointerEvent) {
      if (e.pointerId !== e0.pointerId) return;
      callbacks.onMove?.(e);
    },
    onUp(e: PointerEvent) {
      if (e.pointerId !== e0.pointerId) return;
      callbacks.onUpOrCancel?.(e, "up");
      self.cleanup();
    },
    onCancel(e: PointerEvent) {
      if (e.pointerId !== e0.pointerId) return;
      callbacks.onUpOrCancel?.(e, "cancel");
      self.cleanup();
    },
    setup() {
      win.addEventListener("pointermove", self.onMove);
      win.addEventListener("pointerup", self.onUp);
      win.addEventListener("pointercancel", self.onCancel);
      try {
        el.setPointerCapture(e0.pointerId);
      } catch {}
    },
    cleanup() {
      try {
        el.releasePointerCapture(e0.pointerId);
      } catch {}
      win.removeEventListener("pointermove", self.onMove);
      win.removeEventListener("pointerup", self.onUp);
      win.removeEventListener("pointercancel", self.onCancel);
    },
  };
  self.setup();
}
