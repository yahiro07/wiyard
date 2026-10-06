import { KeyName } from "@lib/contract";
import { WindowSpec } from "@lib/window-system";
import { HsUnitStateData } from "wafer-host/core";
import { FieldSight } from "@/components/field-sight-plane";
import {
  GraphSpec,
  UnitControlEffectItem,
  UnitItem,
  WindowId,
} from "@/domain/types";
import { Size } from "@lib/utils/common-types";
import { AppWorkspaceSettings } from "@/common/app-settings";

export type ProjectStoreStates = {
  unitItems: UnitItem[];
  unitControlEffects: Record<string, UnitControlEffectItem>;
  wireConnectionKeys: string[];
  wireGains: Record<string, number>;
  wireAutomationParameterIds: Record<string, string>;
  windowSpecs: Record<WindowId, WindowSpec>;
  currentNoteChannelId: string;
  currentAutomationChannelId: string | null;
  currentWindowId: string | null;
  windowsEvacuated: boolean;
  bpm: number;
  sight: FieldSight;
  keyName: KeyName;
  unitClockingFlags: Record<string, boolean>;
  boardSize: Size;
  graphSpec: GraphSpec;
};

export type ProjectData = {
  appVersionCode: string;
  pageDeployId: string;
  formatCode: string;
  storeStates: ProjectStoreStates;
  unitStates: HsUnitStateData[];
  workspaceSettings: AppWorkspaceSettings;
};

export const projectsConstants = {
  formatCode: "WBP1",
};
