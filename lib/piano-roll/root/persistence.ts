import { clampValue } from "@lib/utils/number-helper";
import { Persistence } from "wafer-host/unit-types";
import {
  LoopBarLength,
  Note,
  PatternBarLength,
  Sight,
} from "../definitions/types";
import { AppStore } from "./store";

namespace _persistenceSpecTypes {
  type _StoreState = {
    octaveShift: number; //+100
    noteDuty: number; //*255
    playPos: number | null;
    loopBars: LoopBarLength; //*4
    pageIndex: number;
    inputNotes: Note[]; //length 2bytes, ...[id>>8&0xff, id&0xff, position, duration, pitch]
    previewNotePitch: number | null;
    stateLoadRevision: number;
    sight: Sight; //[xPosition*255, yPosition*255, xZoom*255, yZoom*255]
    patternNotes: Note[]; //length 2bytes, ...[id>>8&0xff, id&0xff, position, duration, pitch]
    isPatternView: boolean;
    patternBars: PatternBarLength; //*4
    patternEnabled: boolean; //0 or 1
    mappedNotes: Note[] | null;
    realized: boolean; //0 or 1
    backupInputNotes: Note[] | null; //length 2bytes, ...[id>>8&0xff, id&0xff, position, duration, pitch]
    diatonicLanesEnabled: boolean; //0 or 1
    diatonicLanesAllowSemitoneInput: boolean; //0 or 1
  };
}

const loopBarLengths: LoopBarLength[] = [0.25, 0.5, 1, 2, 4, 8, 16];
const patternBarLengths: PatternBarLength[] = [0.25, 0.5, 1, 2];

function unaryToByte(value: number): number {
  return (clampValue(value, 0, 1) * 255) >>> 0;
}

function unaryFromByte(byte: number): number {
  return byte / 255;
}

function boolToByte(value: boolean): number {
  return value ? 1 : 0;
}

function encodeNotes(notes: Note[]): number[] {
  return [
    (notes.length >> 8) & 0xff,
    notes.length & 0xff,
    ...notes.flatMap((note) => [
      (note.id >> 8) & 0xff,
      note.id & 0xff,
      note.position,
      note.duration,
      note.pitch,
    ]),
  ];
}

function createByteReader(bytes: Uint8Array, offset: number, ok: boolean) {
  const self = {
    readByte(): number {
      if (offset >= bytes.length) {
        ok = false;
        return 0;
      }
      return bytes[offset++];
    },
    readBoolByte(): boolean {
      const byte = self.readByte();
      if (byte !== 0 && byte !== 1) {
        ok = false;
      }
      return byte === 1;
    },
    readNotes(): Note[] {
      const count = (self.readByte() << 8) | self.readByte();
      const notes: Note[] = [];
      for (let i = 0; i < count; i++) {
        const id = (self.readByte() << 8) | self.readByte();
        const position = self.readByte();
        const duration = self.readByte();
        const pitch = self.readByte();
        notes.push({ id, position, duration, pitch });
      }
      return notes;
    },
    get ok() {
      return ok;
    },
    get offset() {
      return offset;
    },
  };
  return self;
}

export function createPersistence(store: AppStore): Persistence {
  const magics = { first: 123, second: 46 };

  return {
    emitStateBytes(): Uint8Array {
      const st = store.state;
      const backupBytes =
        st.backupInputNotes === null
          ? [0]
          : [1, ...encodeNotes(st.backupInputNotes)];
      return new Uint8Array([
        magics.first,
        magics.second,
        st.octaveShift + 100,
        unaryToByte(st.noteDuty),
        Math.floor(st.loopBars * 4),
        ...encodeNotes(st.inputNotes),
        unaryToByte(st.sight.xPosition),
        unaryToByte(st.sight.yPosition),
        unaryToByte(st.sight.xZoom),
        unaryToByte(st.sight.yZoom),
        ...encodeNotes(st.patternNotes),
        Math.floor(st.patternBars * 4),
        boolToByte(st.patternEnabled),
        boolToByte(st.realized),
        ...backupBytes,
        boolToByte(st.diatonicLanesEnabled),
        boolToByte(st.diatonicLanesAllowSemitoneInput),
      ]);
    },
    applyStateBytes(bytes) {
      if (!(bytes[0] === magics.first && bytes[1] === magics.second)) return;
      const reader = createByteReader(bytes, 2, true);
      const octaveShift = reader.readByte() - 100;
      const noteDuty = unaryFromByte(reader.readByte());
      const loopBars = reader.readByte() / 4;
      const inputNotes = reader.readNotes();
      const sight: Sight = {
        xPosition: unaryFromByte(reader.readByte()),
        yPosition: unaryFromByte(reader.readByte()),
        xZoom: unaryFromByte(reader.readByte()),
        yZoom: unaryFromByte(reader.readByte()),
      };
      const patternNotes = reader.readNotes();
      const patternBars = reader.readByte() / 4;
      const patternEnabled = reader.readBoolByte();
      const realized = reader.readBoolByte();
      const backupPresent = reader.readBoolByte();
      const backupInputNotes = backupPresent ? reader.readNotes() : null;
      const diatonicLanesEnabled = reader.readBoolByte();
      const diatonicLanesAllowSemitoneInput = reader.readBoolByte();
      const valid = [
        reader.ok,
        reader.offset === bytes.length,
        -2 <= octaveShift && octaveShift <= 2,
        0 <= noteDuty && noteDuty <= 1,
        loopBarLengths.includes(loopBars as LoopBarLength),
        0 <= sight.xPosition && sight.xPosition <= 1,
        0 <= sight.yPosition && sight.yPosition <= 1,
        0 <= sight.xZoom && sight.xZoom <= 1,
        0 <= sight.yZoom && sight.yZoom <= 1,
        patternBarLengths.includes(patternBars as PatternBarLength),
      ].every(Boolean);
      if (!valid) return;
      store.assign({
        octaveShift,
        noteDuty,
        loopBars: loopBars as LoopBarLength,
        inputNotes,
        sight,
        patternNotes,
        patternBars: patternBars as PatternBarLength,
        patternEnabled,
        realized,
        backupInputNotes,
        diatonicLanesEnabled,
        diatonicLanesAllowSemitoneInput,
      });
      store.setStateLoadRevision((prev) => prev + 1);
    },
  };
}
