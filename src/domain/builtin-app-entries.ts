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

export const builtinAppItems: BuiltinAppItem[] = [
  {
    windowId: windowIds.sequencer,
    title: "piano roll",
    dockItemSpec: {
      icon: Icons.Timeline,
      bgColor: "#46a",
      fontSize: 28,
    },
    windowInitialSize: { width: 1000, height: 600 },
    windowFreeRatio: true,
  },
  {
    windowId: windowIds.automationEditor,
    title: "automation",
    dockItemSpec: {
      icon: Icons.DirectionRight,
      bgColor: "#46a",
      fontSize: 28,
    },
    windowInitialSize: { width: 900, height: 220 },
    windowFreeRatio: true,
  },
  {
    windowId: windowIds.keyboard,
    title: "keyboard",
    dockItemSpec: {
      icon: Icons.Piano,
      bgColor: "#46a",
      fontSize: 28,
    },
    windowInitialSize: { width: 480, height: 154 },
  },
  {
    windowId: windowIds.controlSurface,
    title: "control surface",
    dockItemSpec: {
      icon: Icons.DirectionRight,
      bgColor: "#46a",
      fontSize: 28,
    },
    windowInitialSize: { width: 800, height: 400 },
  },
];
