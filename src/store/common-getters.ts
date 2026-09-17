import { UnitItem } from "@/domain/types";
import { store } from "@/store/store";

export const commonGetters = {
  getUnitItemById(unitId: string): UnitItem | undefined {
    return store.state.unitItems.find((it) => it.unitId === unitId);
  },
  getAutomationEditorUnitItems() {
    return store.state.unitItems.filter((it) => it.type === "automationEditor");
  },
};
