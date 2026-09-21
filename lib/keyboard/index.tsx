import { clampValue } from "@lib/utils/number-helper";
import { useMemo } from "react";
import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { KeyboardOctaveBlock, KeyboardTopKey } from "./keyboard-block";
import { OctaveShifter } from "./octave-shifter";

export const createKeyboardUnit: ReactUnitTemplateFn = (unitInterface) => {
  const noteOutputPort = unitInterface.createNoteOutputPort();

  const notesMap = new Map<number, number>(); // key: noteKey, value: noteNumber

  const store = createStore({
    notes: [] as number[],
    octave: 0, //-2~+2
    viewActive: false,
  });

  const actions = {
    async noteOn(noteKey: number) {
      const noteNumber = noteKey + store.state.octave * 12;
      store.setNotes((prev) => [...prev, noteNumber]);
      noteOutputPort.noteOn(noteNumber);
      notesMap.set(noteKey, noteNumber);
    },
    noteOff(noteKey: number) {
      const noteNumber = notesMap.get(noteKey);
      if (noteNumber !== undefined) {
        store.setNotes((prev) => prev.filter((n) => n !== noteNumber));
        noteOutputPort.noteOff(noteNumber);
        notesMap.delete(noteKey);
      }
    },
    setOctave(octave: number) {
      store.setOctave(octave);
    },
  };

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      categoryHint: "keyboard",
      viewSize: [480, 154],
    },
    noteInput: {
      noteOn: actions.noteOn,
      noteOff: actions.noteOff,
    },
    unitCallbacks: {
      setViewActive: store.setViewActive,
    },
    persistence: {
      emitStateBytes() {
        return new Uint8Array([store.state.octave + 100]);
      },
      applyStateBytes(bytes) {
        if (bytes.length === 0) return;
        const octave = clampValue(bytes[0] - 100, -2, 2);
        actions.setOctave(octave);
      },
    },
  });

  const App = () => {
    const { notes, octave } = store.useSnapshot();
    const activeNotes = useMemo(() => {
      return notes.map((noteNumber) => noteNumber - octave * 12);
    }, [notes, octave]);
    const labelOctaveIndex = 3 + octave;
    return (
      <div className="w-480px h-154px flex-c px-1 bg-#b0b0b0">
        <div className="flex-v gap-2.5">
          <OctaveShifter octave={octave} setOctave={actions.setOctave} />
          <div className="flex-h touch-none" data-keyboard-root>
            <KeyboardOctaveBlock
              baseNoteNumber={48}
              activeNotes={activeNotes}
              noteOn={actions.noteOn}
              noteOff={actions.noteOff}
              rootLabel={`C${labelOctaveIndex}`}
            />
            <KeyboardOctaveBlock
              baseNoteNumber={60}
              activeNotes={activeNotes}
              noteOn={actions.noteOn}
              noteOff={actions.noteOff}
              rootLabel={`C${labelOctaveIndex + 1}`}
            />
            <KeyboardTopKey
              noteNumber={72}
              activeNotes={activeNotes}
              noteOn={actions.noteOn}
              noteOff={actions.noteOff}
              rootLabel={`C${labelOctaveIndex + 2}`}
            />
          </div>
        </div>
      </div>
    );
  };

  return {
    RenderUi() {
      const { viewActive } = store.useSnapshot();
      if (!viewActive) return null;
      return <App />;
    },
  };
};
