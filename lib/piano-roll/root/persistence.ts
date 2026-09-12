import { Persistence } from "wafer-host/unit-types";
import { LoopBarLength } from "../definitions/types";
import { clampValue } from "../utils/helpers";
import { AppStore } from "./store";

function unaryToByte(value: number): number {
  return (clampValue(value, 0, 1) * 255) >>> 0;
}

function unaryFromByte(byte: number): number {
  return byte / 255;
}

export function createPersistence(store: AppStore): Persistence {
  return {
    emitStateBytes(): Uint8Array {
      const st = store.state;
      return new Uint8Array([
        123,
        45,
        st.octave + 10,
        unaryToByte(st.duty),
        Math.floor(st.loopBars * 4),
        (st.notes.length >> 8) & 0xff,
        st.notes.length & 0xff,
        ...st.notes.flatMap((note) => {
          return [
            (note.id >> 8) & 0xff,
            note.id & 0xff,
            note.position,
            note.duration,
            note.pitch,
          ];
        }),
      ]);
    },
    applyStateBytes(bytes) {
      if (!(bytes[0] === 123 && bytes[1] === 45)) return;
      const octave = bytes[2] - 10;
      const duty = unaryFromByte(bytes[3]);
      const loopBars = bytes[4] / 4;
      const numNotes = (bytes[5] << 8) | bytes[6];
      const notes = [];
      for (let i = 0; i < numNotes; i++) {
        const base = 7 + i * 5;
        const id = (bytes[base + 0] << 8) | bytes[base + 1];
        const position = bytes[base + 2];
        const duration = bytes[base + 3];
        const pitch = bytes[base + 4];
        notes.push({ id, position, duration, pitch });
      }
      const valid = [
        -2 <= octave && octave <= 2,
        0 <= duty && duty <= 1,
        [0.25, 0.5, 1, 2, 4, 8, 16].includes(loopBars),
        notes.length === numNotes,
      ].every(Boolean);
      if (!valid) return;
      store.assign({
        octave,
        duty,
        loopBars: loopBars as LoopBarLength,
        notes,
        pageIndex: 0,
      });
      store.setStateLoadRevision((prev) => prev + 1);
    },
  };
}
