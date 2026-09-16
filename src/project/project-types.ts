import { KeyName } from "@lib/contract";
import { WindowSpec } from "@lib/window-system";
import { HsUnitStateData } from "wafer-host/core";
import { FieldSight } from "@/components/field-sight-plane";
import { UnitItem, WindowId } from "@/domain/types";

export type ProjectStoreStates = {
  unitItems: UnitItem[];
  wireConnectionKeys: string[];
  wireGains: Record<string, number>;
  wireAutomationParameterIds: Record<string, string>;
  windowSpecs: Record<WindowId, WindowSpec>;
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
