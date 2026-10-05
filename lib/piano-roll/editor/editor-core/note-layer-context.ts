import { createContext, useContext } from "react";
import { EditorKind, Note } from "../../definitions/types";
import { DisplaySpec, SectionRange } from "../common/editor-types";

export type NoteLayerContextValue = {
  sectionRange: SectionRange;
  displaySpec: DisplaySpec;
  editorKind: EditorKind;
  notes: Note[];
  loopSteps: number;
  loopGhostEnabled: boolean;
  patternEnabled: boolean;
  octaveShift: number;
  noteDuty: number;
  editStride: number;
};

export const noteLayerContext = createContext<NoteLayerContextValue>({} as any);

export function useNoteLayerContext() {
  return useContext(noteLayerContext);
}
