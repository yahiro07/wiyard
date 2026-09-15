import { KeyName } from "@lib/contract";
import { WindowSpec } from "@lib/window-system";
import { HsUnitStateData } from "wafer-host/core";
import { FieldSight } from "@/components/field-sight-plane";
import { UnitItem, WindowId } from "@/domain/types";

export type ProjectStoreStates = {
  unitItems: UnitItem[];
  windowSpecs: Record<WindowId, WindowSpec>;
  wireConnectionKeys: string[];
  currentNoteChannelId: string;
  currentWindowId: string | null;
  windowsEvacuated: boolean;
  bpm: number;
  sight: FieldSight;
  keyName: KeyName;
};

export type ProjectData = {
  appVersionCode: string;
  pageDeployId: string;
  formatCode: string;
  storeStates: ProjectStoreStates;
  unitStates: HsUnitStateData[];
};

export const projectsConstants = {
  formatCode: "WBP1",
};
