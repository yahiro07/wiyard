import { Point } from "beams/ax-ui/common-types";
import { CatalogKey } from "@/base/showcase-entries";
import { slotCardDimensions } from "@/base/slot-card-dimensions";
import { store, UnitItem } from "@/store/store";

const actionsInternal = {
  patchUnitItem(unitId: string, attrs: Partial<UnitItem>) {
    store.setUnitItems((prev) =>
      prev.map((item) =>
        item.unitId === unitId ? { ...item, ...attrs } : item,
      ),
    );
  },
};

function getNextUnitId(existingItems: UnitItem[]) {
  let maxNumber = Math.max(
    ...existingItems.map((item) =>
      parseInt(item.unitId.replace("unit", ""), 10),
    ),
  );
  if (!Number.isFinite(maxNumber)) maxNumber = 0;
  return `unit${maxNumber + 1}`;
}

export const actions = {
  setUnitPosition(unitId: string, position: Point) {
    if (unitId === "$output") {
      store.patchSpeakerPort({ position });
    } else if (unitId === "$keyboard") {
      store.patchKeyboardPort({ position });
    } else {
      actionsInternal.patchUnitItem(unitId, { position });
    }
  },
  addUnit(catalogKey: CatalogKey, position: Point) {
    store.setUnitItems((prev) => [
      ...prev,
      {
        unitId: getNextUnitId(prev),
        catalogKey,
        position,
      },
    ]);
  },
  removeConnection(unitId: string) {
    if (unitId === "$keyboard") {
      store.patchKeyboardPort({ destUnitId: undefined });
    } else {
      actionsInternal.patchUnitItem(unitId, { destUnitId: undefined });
    }
  },
  connectToNearestUnit(unitId: string) {
    const { unitItems, speakerPort, keyboardPort } = store.state;
    const unit =
      unitId === "$keyboard"
        ? keyboardPort
        : unitItems.find((item) => item.unitId === unitId);
    if (!unit) return;
    const hh = slotCardDimensions.height / 2;

    const targetUnits = [
      ...unitItems.filter(
        (item) =>
          item.unitId !== unitId && item.position.y + hh < unit.position.y - hh,
      ),
      speakerPort,
    ];
    const measured = targetUnits.map((item) => ({
      unitId: item.unitId,
      distance: Math.hypot(
        item.position.x - unit.position.x,
        item.position.y - unit.position.y,
      ),
    }));
    const sorted = measured.sort((a, b) => a.distance - b.distance);
    const nearestUnit = sorted[0];
    if (!nearestUnit) return;
    const destUnitId = nearestUnit.unitId;

    if (unitId === "$keyboard") {
      store.patchKeyboardPort({ destUnitId });
    } else {
      actionsInternal.patchUnitItem(unitId, { destUnitId });
    }
  },
  removeUnit(unitId: string) {
    actionsInternal.patchUnitItem(unitId, { destUnitId: undefined });
    const dependentUnits = store.state.unitItems.filter(
      (item) => item.destUnitId === unitId,
    );
    for (const dependentUnit of dependentUnits) {
      actionsInternal.patchUnitItem(dependentUnit.unitId, {
        destUnitId: undefined,
      });
    }
    store.setUnitItems((prev) => prev.filter((item) => item.unitId !== unitId));
  },
  midiInNoteOn(noteNumber: number) {
    if (!store.state.notes.includes(noteNumber)) {
      store.setNotes((prev) => [...prev, noteNumber]);
    }
  },
  midiInNoteOff(noteNumber: number) {
    store.setNotes((prev) => prev.filter((item) => item !== noteNumber));
  },
};
