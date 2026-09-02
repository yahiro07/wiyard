import "./page.css";
import "beams/ax-ui/utility-classes.css";
//
import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { setupMidiKeyboardInput } from "beams/mx-audio/midi-keyboard-input";
import { useEffect } from "react";
import { CreditsPanel } from "@/sections/credits-panel";
import { PickerColumn } from "@/sections/picker-column";
import { EditField } from "./sections/edit-field";
import { actions } from "./store/actions";
import { HostAppProvider } from "wus-host/react";
import { hostSystem } from "@/store/store";

const PageRoot = () => {
  return (
    <div className="w-dvw h-dvh bg-gray-700 flex-h">
      <PickerColumn />
      <EditField />
      {false && <CreditsPanel />}
    </div>
  );
};

const App = () => {
  useEffect(
    () =>
      setupMidiKeyboardInput({
        noteOn: actions.midiInNoteOn,
        noteOff: actions.midiInNoteOff,
      }),
    [],
  );
  return (
    <HostAppProvider hostSystem={hostSystem}>
      <PageRoot />
    </HostAppProvider>
  );
};

mountAppRoot(<App />);
