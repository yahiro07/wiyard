import { useEffect } from "react";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { setupUnit } from "./root/drivers";
import { PageRoot } from "./root/page-root";

export const createPianoRollUnit: ReactUnitTemplateFn = (unitInterface) => {
  const { setupSynchronization } = setupUnit(unitInterface);
  return {
    RenderUi() {
      useEffect(setupSynchronization, [setupSynchronization]);
      return <PageRoot />;
    },
  };
};
