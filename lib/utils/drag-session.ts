type Point = { x: number; y: number };
type Size = { width: number; height: number };
type Vector = Point;

const getDist = (p1: Point, p2: Point): number => {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
};

//----------

type DragSessionCallbacks = {
  onMove?(pos: Point, relativeMoveAmountFromStart: Vector): void;
  onEnd?(cause: "end" | "cancel"): void;
};

type DragSession = {
  getStartPosition(): Point;
  getBaseSize(): Size;
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
    options?.coordinateBaseElement ?? (inputEvent.currentTarget as HTMLElement);
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
    getStartPosition: () => startPosition,
    getBaseSize: () => ({
      width: baseEl.offsetWidth,
      height: baseEl.offsetHeight,
    }),
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
  onHold?(): void;
  onCancel?(): void;
  onEnd?(pos: Point): void; //called after either up/tap/cancel
};

type DragSessionEx = {
  getStartPosition(): Point;
  getBaseSize(): Size;
  run(callbacks: DragSessionCallbacksEx): void;
};

type DragSessionExOptions = {
  //if provided, pos will be relative to this element,
  //otherwise pos will be relative to currentTarget of the initiated pointer event
  coordinateBaseElement?: HTMLElement;
  tapDurationTh?: number;
  tapHoldDistanceTh?: number;
  holdDurationTh?: number;
};

//onStart is called after either
//--tapDurationTh elapsed
//OR
//--track distance exceeds tapDistanceTh
export function createDragSessionEx(
  inputEvent: PointerEvent | React.PointerEvent,
  options?: DragSessionExOptions,
): DragSessionEx {
  const tapHoldDistanceTh = options?.tapHoldDistanceTh ?? 8;
  const tapDurationTh = options?.tapDurationTh ?? 200;
  const holdDurationTh = options?.holdDurationTh ?? 250;

  const e0 = "nativeEvent" in inputEvent ? inputEvent.nativeEvent : inputEvent;

  const baseEl =
    options?.coordinateBaseElement ?? (inputEvent.currentTarget as HTMLElement);
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
  let timerId2: NodeJS.Timeout | undefined;
  let started = false;
  let latestPosition = startPosition;

  return {
    getStartPosition: () => startPosition,
    getBaseSize: () => ({
      width: baseEl.offsetWidth,
      height: baseEl.offsetHeight,
    }),
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
      const cancelTimers = () => {
        if (timerId) {
          clearTimeout(timerId);
          timerId = undefined;
        }
        if (timerId2) {
          clearTimeout(timerId2);
          timerId2 = undefined;
        }
      };
      const checkHold = () => {
        const dist = getDist(latestPosition, startPosition);
        if (dist < tapHoldDistanceTh) {
          callbacks.onHold?.();
        }
      };
      timerId = setTimeout(() => triggerStart(latestPosition), tapDurationTh);
      timerId2 = setTimeout(checkHold, holdDurationTh);

      startPointerCaptureSession(e0, {
        onMove(e) {
          const pos = getPos(e);
          if (!started) {
            const distFromStart = getDist(pos, startPosition);
            if (distFromStart > tapHoldDistanceTh) {
              triggerStart(pos);
              cancelTimers();
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
          cancelTimers();
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

export function startPointerCaptureSession(
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
