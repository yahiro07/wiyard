import { UnitItem } from "@/domain/types";
import { CatalogKey } from "@/domain/unit-entries";
import { safeParseInt } from "@/utils/helpers";

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
