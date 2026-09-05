import { HsPortDirection, HsPortSubtype } from "wafer-host/core";

export type UnitPortSpec = {
  direction: HsPortDirection;
  subtype: HsPortSubtype;
  portKey: string;
  id: string;
  label?: string;
};

export type UnitStuff = {
  status: "loading" | "loaded" | "error";
  inputPortSpecs?: UnitPortSpec[];
  outputPortSpecs?: UnitPortSpec[];
};
