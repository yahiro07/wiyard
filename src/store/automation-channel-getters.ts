import { AutomationEditorUnitItem, UnitPortSpec } from "@/domain/types";
import { store } from "@/store/store";
import { useMemo } from "react";

export const automationChannelGetters = {
  useAutomationChannelIds(): string[] {
    const { unitItems } = store.useSnapshot();
    return unitItems
      .filter((it) => it.type === "automationEditor")
      .map((it) => it.unitId);
  },
  useAutomationEditorUnitItems(): AutomationEditorUnitItem[] {
    const { unitItems } = store.useSnapshot();
    return useMemo(
      () => unitItems.filter((it) => it.type === "automationEditor"),
      [unitItems],
    );
  },
  useAutomationEditorOutputPortSpecs(): UnitPortSpec[] {
    const { unitItems, unitStuffs } = store.useSnapshot();
    return useMemo(() => {
      const res = unitItems
        .filter((it) => it.type === "automationEditor")
        .flatMap((it) => unitStuffs[it.unitId]?.outputPortSpecs ?? []);
      return res.map((item, index) => ({
        ...item,
        label: (index + 1).toString(),
      }));
    }, [unitItems, unitStuffs]);
  },
};
