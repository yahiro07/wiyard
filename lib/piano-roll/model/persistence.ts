import { clampValue } from "@lib/utils/number-helper";
import { Persistence } from "wafer-host/unit-types";
import { LoopBarLength, Note, Sight } from "../definitions/types";
import { AppStore, resetterStates } from "./store";

const loopBarLengths: LoopBarLength[] = [0.25, 0.5, 1, 2, 4, 8, 16];

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
    next(): number {
      if (offset >= bytes.length) {
        ok = false;
        return 0;
      }
      return bytes[offset++];
    },
    readNotes(): Note[] {
      const count = (self.next() << 8) | self.next();
      const notes: Note[] = [];
      for (let i = 0; i < count; i++) {
        const id = (self.next() << 8) | self.next();
        const position = self.next();
        const duration = self.next();
        const pitch = self.next();
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

const bytesSerializer = {
  float: (value: number) => (value * 255) >>> 0,
  uint: (value: number) => value,
  bool: (value: boolean) => (value ? 1 : 0),
  octave: (value: number) => value + 100,
  loopBars: (value: number) => Math.floor(value * 4),
  sightBars: (value: number) => {
    return Math.round(value * 10); //0.0~16.0 --> 0~160
  },
};
const bytesDeserializer = {
  float: (byte: number) => clampValue(byte / 255, 0, 1),
  uint: (byte: number, min: number, max: number) => clampValue(byte, min, max),
  bool: (byte: number) => byte !== 0,
  octave: (byte: number) => clampValue(byte - 100, -2, 2),
  loopBars: (byte: number) => byte / 4,
  sightBars: (byte: number) => byte / 10,
};

export function createPersistence(store: AppStore): Persistence {
  const magics = { first: 123, second: 49, tail: 124 };

  return {
    emitStateBytes(): Uint8Array {
      const st = store.state;
      const backupBytes =
        st.backupInputNotes === null
          ? [0]
          : [1, ...encodeNotes(st.backupInputNotes)];

      const bs = bytesSerializer;
      return new Uint8Array([
        magics.first,
        magics.second,
        bs.octave(st.octaveShift),
        bs.float(st.noteDuty),
        bs.loopBars(st.loopBars),
        ...encodeNotes(st.inputNotes),
        bs.sightBars(st.sight.xBarPosition),
        bs.float(st.sight.yPosition),
        bs.sightBars(st.sight.wBars),
        bs.float(st.sight.yZoom),
        bs.bool(st.sight.withXPadding),
        ...encodeNotes(st.patternNotes),
        bs.bool(st.patternEnabled),
        bs.bool(st.realized),
        ...backupBytes,
        bs.bool(st.diatonicLanesEnabled),
        bs.bool(st.diatonicLanesAllowSemitoneInput),
        bs.bool(st.loopGhostEnabled),
        magics.tail,
      ]);
    },
    applyStateBytes(bytes) {
      if (!(bytes[0] === magics.first && bytes[1] === magics.second)) return;
      const reader = createByteReader(bytes, 2, true);
      const bd = bytesDeserializer;
      const octaveShift = bd.octave(reader.next());
      const noteDuty = bd.float(reader.next());
      const loopBars = bd.loopBars(reader.next());
      const inputNotes = reader.readNotes();
      const sight: Sight = {
        xBarPosition: bd.sightBars(reader.next()),
        yPosition: bd.float(reader.next()),
        wBars: bd.sightBars(reader.next()),
        yZoom: bd.float(reader.next()),
        withXPadding: bd.bool(reader.next()),
      };
      const patternNotes = reader.readNotes();
      const patternEnabled = bd.bool(reader.next());
      const realized = bd.bool(reader.next());
      const backupPresent = bd.bool(reader.next());
      const backupInputNotes = backupPresent ? reader.readNotes() : null;
      const diatonicLanesEnabled = bd.bool(reader.next());
      const diatonicLanesAllowSemitoneInput = bd.bool(reader.next());
      const loopGhostEnabled = bd.bool(reader.next());
      const tailMagic = reader.next();
      const valid = [
        reader.ok,
        reader.offset === bytes.length,
        tailMagic === magics.tail,
        -2 <= octaveShift && octaveShift <= 2,
        0 <= noteDuty && noteDuty <= 1,
        loopBarLengths.includes(loopBars as LoopBarLength),
        0 <= sight.xBarPosition && sight.xBarPosition <= 16,
        0 <= sight.yPosition && sight.yPosition <= 1,
        1 <= sight.wBars && sight.wBars <= 16,
        0 <= sight.yZoom && sight.yZoom <= 1,
      ].every(Boolean);
      if (!valid) return;
      store.assign({
        ...resetterStates,
        octaveShift,
        noteDuty,
        loopBars: loopBars as LoopBarLength,
        inputNotes,
        sight,
        patternNotes,
        patternEnabled,
        realized,
        backupInputNotes,
        diatonicLanesEnabled,
        diatonicLanesAllowSemitoneInput,
        loopGhostEnabled,
      });
      store.setStateLoadRevision((prev) => prev + 1);
    },
  };
}
