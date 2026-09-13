import { safeParseInt } from "@lib/utils/number-helper";
import { UnitItem } from "@/domain/types";
import { CatalogKey } from "@/domain/unit-entries";

export function getNextUnitId(
  existingUnits: UnitItem[],
  catalogKey: CatalogKey,
) {
  const prefix = `${catalogKey}_`;
  const numbers = existingUnits
    .filter((item) => item.unitId.startsWith(prefix))
    .map((item) => {
      const text = item.unitId.replace(prefix, "");
      return safeParseInt(text, 0);
    });
  const nextNumber = Math.max(0, ...numbers) + 1;
  return `${catalogKey}_${nextNumber}`;
}

const kNoteInputPortIdPrefix = "noteInputPort";

export function getNextNoteInputPortUnitId(existingUnits: UnitItem[]) {
  const numbers = existingUnits
    .filter((item) => item.unitId.startsWith(kNoteInputPortIdPrefix))
    .map((item) => {
      const text = item.unitId.slice(kNoteInputPortIdPrefix.length);
      return safeParseInt(text, 0);
    });
  const nextNumber = Math.max(0, ...numbers) + 1;
  return `${kNoteInputPortIdPrefix}${nextNumber}`;
}
