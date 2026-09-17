import { safeParseInt } from "@lib/utils/number-helper";
import { UnitItem } from "@/domain/types";
import { CatalogKey } from "@/domain/unit-entries";

const internal = {
  getNextUnitId(existingUnits: UnitItem[], prefix: string) {
    const numbers = existingUnits
      .filter((item) => item.unitId.startsWith(prefix))
      .map((item) => {
        const text = item.unitId.slice(prefix.length);
        return safeParseInt(text, 0);
      });
    const nextNumber = Math.max(0, ...numbers) + 1;
    return `${prefix}${nextNumber}`;
  },
};

export const unitIdHelper = {
  getNextUnitId(existingUnits: UnitItem[], catalogKey: CatalogKey) {
    const prefix = `${catalogKey}_`;
    return internal.getNextUnitId(existingUnits, prefix);
  },
  getNextNoteInputPortUnitId(existingUnits: UnitItem[]) {
    return internal.getNextUnitId(existingUnits, "noteInputPort");
  },
  getNextAutomationEditorUnitId(existingUnits: UnitItem[]) {
    return internal.getNextUnitId(existingUnits, "automationEditor");
  },
};
