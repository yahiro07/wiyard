import { Icons } from "@/common/icons";
import { windowIds } from "@/domain/types";
import { Size } from "@lib/utils/common-types";
import { IconType } from "react-icons";

type BuiltinAppItem = {
  windowId: string;
  title: string;
  dockItemSpec: {
    icon: IconType;
    bgColor: string;
    fontSize: number;
  };
  windowInitialSize: Size;
  windowFreeRatio?: boolean;
};

export const builtinAppIcons = {
  pianoRoll: Icons.MusicalNotes,
  automation: Icons.Graph,
  keyboard: Icons.Piano,
  controlSurface: Icons.Control,
};

export const builtinAppItems: BuiltinAppItem[] = [
  {
    windowId: windowIds.pianoRoll,
    title: "piano roll",
    dockItemSpec: {
      icon: builtinAppIcons.pianoRoll,
      bgColor: "#67d",
      fontSize: 26,
    },
    windowInitialSize: { width: 1000, height: 600 },
    windowFreeRatio: true,
  },
  {
    windowId: windowIds.controlSurface,
    title: "control surface",
    dockItemSpec: {
      icon: builtinAppIcons.controlSurface,
      bgColor: "#58c",
      fontSize: 28,
    },
    windowInitialSize: { width: 800, height: 400 },
  },
  {
    windowId: windowIds.automationEditor,
    title: "automation",
    dockItemSpec: {
      icon: builtinAppIcons.automation,
      bgColor: "#58c",
      fontSize: 23,
    },
    windowInitialSize: { width: 900, height: 220 },
    windowFreeRatio: true,
  },
  {
    windowId: windowIds.keyboard,
    title: "keyboard",
    dockItemSpec: {
      icon: builtinAppIcons.keyboard,
      bgColor: "#58c",
      fontSize: 28,
    },
    windowInitialSize: { width: 480, height: 154 },
  },
];
