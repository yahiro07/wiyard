import { HsUnitInstance } from "wafer-host/core";
import { buildUnitStuffLoaded } from "@/presenter/unit-stuff-builder";
import { actions } from "@/store/actions";

export function useUnitStuffReporter(unitId: string) {
  const reportLoadStart = () => {
    actions.setUnitStuff(unitId, { status: "loading" });
    return () => {
      actions.setUnitStuff(unitId, null);
    };
  };
  const reportLoaded = (unitInstance: HsUnitInstance) => {
    const unitStuffLoaded = buildUnitStuffLoaded(unitInstance);
    actions.setUnitStuff(unitId, unitStuffLoaded);
  };
  const reportFailure = () => {
    actions.setUnitStuff(unitId, { status: "error" });
  };

  return { reportLoadStart, reportLoaded, reportFailure };
}
