import { HsPortDirection, HsPortSubtype } from "wafer-host/core";

export type UnitPort = {
  direction: HsPortDirection;
  subtype: HsPortSubtype;
  portKey: string;
  id: string;
  label?: string;
};

export type UnitStuff = {
  status: "loading" | "loaded" | "error";
  inputPorts?: UnitPort[];
  outputPort?: UnitPort[];
};
