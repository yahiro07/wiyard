import { useCallback, useRef } from "react";
import { HsUnitInstance } from "wafer-host/core";
import { buildUnitStuffLoaded } from "@/domain/unit-stuff-builder";
import { actions } from "@/store/actions";

export function useUnitStuffReporter(unitId: string) {
  const unsubscribeSizeRef = useRef<() => void>(null);

  const reportLoadStart = useCallback(() => {
    actions.setUnitStuff(unitId, { status: "loading" });
    return () => {
      actions.setUnitStuff(unitId, null);
      if (unsubscribeSizeRef.current) {
        unsubscribeSizeRef.current();
        unsubscribeSizeRef.current = null;
      }
    };
  }, [unitId]);

  const reportLoaded = useCallback(
    (unitInstance: HsUnitInstance) => {
      const unitStuffLoaded = buildUnitStuffLoaded(unitInstance);
      actions.setUnitStuff(unitId, unitStuffLoaded);

      unsubscribeSizeRef.current = unitInstance.subscribeViewSize(
        (viewSize) => {
          actions.setUnitStuff(unitId, { ...unitStuffLoaded, viewSize });
        },
      );
    },
    [unitId],
  );

  const reportFailure = useCallback(() => {
    actions.setUnitStuff(unitId, { status: "error" });
  }, [unitId]);

  return { reportLoadStart, reportLoaded, reportFailure };
}
