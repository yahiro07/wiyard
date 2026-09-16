import { startDragSession } from "@lib/utils/drag-session";
import { seqNumbers } from "@lib/utils/number-helper";

const configs = {
  defaultKeyWidth: 30,
  defaultKeyHeight: 96,
  blackKeyWidthRatio: 0.8,
  blackKeyHeightRatio: 0.58,
};

function handleKeyPointerDown(
  e: React.PointerEvent,
  initialNote: number,
  noteOn: (noteNumber: number) => void,
  noteOff: (noteNumber: number) => void,
) {
  const keyboardRoot = e.currentTarget.closest("[data-keyboard-root]");
  let currentNote: number | undefined;
  const switchNote = (nextNote: number | undefined) => {
    if (nextNote === currentNote) return;
    if (currentNote !== undefined) {
      noteOff(currentNote);
    }
    currentNote = nextNote;
    if (currentNote !== undefined) {
      noteOn(currentNote);
    }
  };
  const getNoteAtPoint = (x: number, y: number) => {
    const key = document
      .elementFromPoint(x, y)
      ?.closest<HTMLElement>("[data-keyboard-note]");
    if (!key || !keyboardRoot?.contains(key)) {
      return undefined;
    }
    const note = Number(key.dataset.keyboardNote);
    return Number.isFinite(note) ? note : undefined;
  };
  switchNote(initialNote);
  startDragSession(e.nativeEvent, {
    onMove(position) {
      switchNote(getNoteAtPoint(position.x, position.y));
    },
    onEnd() {
      switchNote(undefined);
    },
  });
  e.preventDefault();
}

const colors = {
  active: "#bdf",
};

export const KeyboardOctaveBlock = ({
  baseNoteNumber,
  activeNotes,
  noteOn,
  noteOff,
  keyWidth = configs.defaultKeyWidth,
  keyHeight = configs.defaultKeyHeight,
  rootLabel,
}: {
  baseNoteNumber: number;
  activeNotes: number[];
  noteOn(noteNumber: number): void;
  noteOff(noteNumber: number): void;
  keyWidth?: number;
  keyHeight?: number;
  rootLabel?: string;
}) => {
  const blackKeyWidth = keyWidth * configs.blackKeyWidthRatio;
  const blackKeyHeight = keyHeight * configs.blackKeyHeightRatio;
  return (
    <div className="relative">
      <div className="flex-h">
        {seqNumbers(7).map((k) => {
          const relatives = [0, 2, 4, 5, 7, 9, 11];
          const noteNumber = baseNoteNumber + relatives[k];
          const active = activeNotes.includes(noteNumber);
          const label = k === 0 && rootLabel;
          return (
            <div
              key={k}
              data-keyboard-note={noteNumber}
              className="border border-#333 cursor-pointer flex-va justify-end"
              style={{
                background: active ? colors.active : "#fff",
                width: keyWidth,
                height: keyHeight,
              }}
              onPointerDown={(e) =>
                handleKeyPointerDown(e, noteNumber, noteOn, noteOff)
              }
            >
              {label && (
                <div className="text-14px text-#333 mb-0.5">{label}</div>
              )}
            </div>
          );
        })}
      </div>
      <div
        className="absolute top-0 left-0 flex-h"
        style={{ paddingLeft: keyWidth * 0.6, gap: keyWidth * 0.2 }}
      >
        {seqNumbers(6).map((k) => {
          const relatives = [1, 3, -1, 6, 8, 10];
          const offsets = [-0.12, 0.12, 0, -0.12, 0, 0.12];
          const noteNumber = baseNoteNumber + relatives[k];
          const active = activeNotes.includes(noteNumber);
          const trX = offsets[k] * blackKeyWidth;
          return (
            <div
              key={k}
              data-keyboard-note={noteNumber}
              className="border border-#333 cursor-pointer"
              style={{
                visibility: k === 2 ? "hidden" : "visible",
                background: active ? colors.active : "#555",
                width: blackKeyWidth,
                height: blackKeyHeight,
                transform: `translateX(${trX}px)`,
              }}
              onPointerDown={(e) =>
                handleKeyPointerDown(e, noteNumber, noteOn, noteOff)
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export const KeyboardTopKey = ({
  noteNumber,
  activeNotes,
  noteOn,
  noteOff,
  keyWidth = configs.defaultKeyWidth,
  keyHeight = configs.defaultKeyHeight,
  rootLabel,
}: {
  noteNumber: number;
  activeNotes: number[];
  noteOn(noteNumber: number): void;
  noteOff(noteNumber: number): void;
  keyWidth?: number;
  keyHeight?: number;
  rootLabel?: string;
}) => {
  return (
    <div className="relative">
      <div className="flex-h">
        {seqNumbers(1).map((k) => {
          const active = activeNotes.includes(noteNumber);
          return (
            <div
              key={k}
              data-keyboard-note={noteNumber}
              className="border border-#333 cursor-pointer flex-va justify-end"
              style={{
                background: active ? colors.active : "#fff",
                width: keyWidth,
                height: keyHeight,
              }}
              onPointerDown={(e) =>
                handleKeyPointerDown(e, noteNumber, noteOn, noteOff)
              }
            >
              {rootLabel && (
                <div className="text-14px text-#333 mb-0.5">{rootLabel}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
