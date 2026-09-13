type MidiKeyboardInputOptions = {
  connectionStateCallback?: (connected: boolean) => void;
  noteOn?: (noteNumber: number, velocity: number /* 0~1 */) => void;
  noteOff?: (noteNumber: number) => void;
};

type MidiKeyboardInputCore = {
  open(): void;
  close(): void;
};

function createMidiKeyboardInputCore(
  midiInput: MIDIInput,
  options: MidiKeyboardInputOptions,
) {
  const handlers = {
    onStateChange() {
      const isConnected = midiInput.connection === "open";
      options.connectionStateCallback?.(isConnected);
      console.log(
        isConnected
          ? `midi input opened: ${midiInput.name}`
          : `midi input closed`,
      );
    },
    onMidiMessage(e: MIDIMessageEvent) {
      if (!e.data) return;
      const [status, data1, data2] = e.data;
      const cmd = status & 0xf0;
      if (cmd === 0x90 && data2 > 0) {
        const [noteNumber, velocity] = [data1, data2];
        options.noteOn?.(noteNumber, velocity / 127);
      } else if (cmd === 0x80 || (cmd === 0x90 && data2 === 0)) {
        const noteNumber = data1;
        options.noteOff?.(noteNumber);
      } else {
        console.log(status, data1, data2);
      }
    },
  };

  return {
    open() {
      midiInput.addEventListener("statechange", handlers.onStateChange);
      midiInput.addEventListener("midimessage", handlers.onMidiMessage);
    },
    close() {
      midiInput.removeEventListener("statechange", handlers.onStateChange);
      midiInput.removeEventListener("midimessage", handlers.onMidiMessage);
      void midiInput.close();
    },
  };
}

async function getFirstMidiInput() {
  const midiAccess = await navigator.requestMIDIAccess();
  if (!midiAccess) return;
  console.log("midi inputs", Array.from(midiAccess.inputs.values()).length);
  const midiInput = Array.from(midiAccess.inputs.values())[0];
  return midiInput;
}

export function setupMidiKeyboardInput(
  options: MidiKeyboardInputOptions,
): () => void {
  let core: MidiKeyboardInputCore | undefined;
  let disposed = false;

  void (async () => {
    const midiInput = await getFirstMidiInput();
    if (disposed) return;
    if (midiInput) {
      core = createMidiKeyboardInputCore(midiInput, options);
      core.open();
    }
  })();

  return () => {
    core?.close();
    disposed = true;
  };
}
