import { mapObjectValues } from "@lib/utils/array-object-helper";
import { WindowSpec } from "./types";

type WindowSpecs = Record<string, WindowSpec>;

export const windowSpecHelper = {
  getNextWindowZOrderTopmost(windowSpecs: WindowSpecs) {
    return (
      Object.values(windowSpecs).reduce((maxZOrder, spec) => {
        return Math.max(maxZOrder, spec.zOrder);
      }, 0) + 1
    );
  },
  refreshZOrders(windowSpecs: WindowSpecs): WindowSpecs {
    const zOrders = Object.values(windowSpecs).map((spec) => spec.zOrder);
    zOrders.sort((a, b) => a - b);
    return mapObjectValues(windowSpecs, (spec) => ({
      ...spec,
      zOrder: zOrders.indexOf(spec.zOrder),
    }));
  },
};
