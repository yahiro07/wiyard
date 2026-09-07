import { useCallback } from "react";
import { HsUnitInstance } from "wafer-host/core";
import { buildUnitStuffLoaded } from "@/domain/unit-stuff-builder";
import { actions } from "@/store/actions";

export function useUnitStuffReporter(unitId: string) {
  const reportLoadStart = useCallback(() => {
    actions.setUnitStuff(unitId, { status: "loading" });
    return () => {
      actions.setUnitStuff(unitId, null);
    };
  }, [unitId]);

  const reportLoaded = useCallback(
    (unitInstance: HsUnitInstance) => {
      const unitStuffLoaded = buildUnitStuffLoaded(unitInstance);
      actions.setUnitStuff(unitId, unitStuffLoaded);
    },
    [unitId],
  );

  const reportFailure = useCallback(() => {
    actions.setUnitStuff(unitId, { status: "error" });
  }, [unitId]);

  return { reportLoadStart, reportLoaded, reportFailure };
}
