import { FC } from "react";
import { Connection, ReactUnitFrame } from "wafer-host/react";
import { renderLog } from "../utils/render-log";
import { UnitFrameScaledEx } from "./unit-frame-scaled-ex";

function makeComponentWithLog<T extends object>(
  fc: FC<T>,
  logFn: (props: T) => void,
) {
  return (props: T) => {
    logFn(props);
    return fc(props);
  };
}

export const ConnectionWithLog = makeComponentWithLog(Connection, (props) => {
  renderLog("Connection", props.source, props.destination);
});

export const ReactUnitFrameWithLog = makeComponentWithLog(
  ReactUnitFrame,
  (props) => {
    renderLog("ReactUnitFrame", props.unitId);
  },
);

export const UnitFrameScaledExWithLog = makeComponentWithLog(
  UnitFrameScaledEx,
  (props) => {
    renderLog("UnitFrameScaledEx", props.unitId);
  },
);
