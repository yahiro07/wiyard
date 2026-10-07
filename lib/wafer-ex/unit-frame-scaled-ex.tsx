import { useEffect, useMemo, useRef, useState } from "react";
import { HsUnitInstance, HsViewSize } from "wafer-host/core";
import { UnitDestinationSpec, UnitFrame } from "wafer-host/react";
import { Size, makeSize, observeElementSize } from "./size-helper";

type Props = {
  unitId: string;
  unitUrl: string;
  destSpec?: UnitDestinationSpec;
  className?: string;
  inputNotes?: number[];
  onIframeMounted?(iframe: HTMLIFrameElement): (() => void) | undefined;
  onUnitInstanceLoaded?(unitInstance: HsUnitInstance): void;
  onLoadFailed?(): void;
  viewActive?: boolean;
  fitMode?: "contain" | "cover";
};

export const UnitFrameScaledEx = ({
  unitId,
  unitUrl,
  destSpec,
  className,
  inputNotes,
  onIframeMounted,
  onUnitInstanceLoaded,
  onLoadFailed,
  viewActive,
  fitMode = "contain",
}: Props) => {
  const outerDivRef = useRef<HTMLDivElement>(null);
  const [outerSize, setOuterSize] = useState<Size | null>(null);
  const [unitInstance, setUnitInstance] = useState<HsUnitInstance | null>(null);
  const [unitViewSize, setUnitViewSize] = useState<HsViewSize | null>(null);

  useEffect(() => {
    const outerDiv = outerDivRef.current!;
    const updateOuterSize = () => {
      const size = makeSize(outerDiv.offsetWidth, outerDiv.offsetHeight);
      setOuterSize(size);
    };
    return observeElementSize(outerDiv, updateOuterSize);
  }, []);

  const handleUnitInstanceLoaded = (unit: HsUnitInstance) => {
    setUnitInstance(unit);
    onUnitInstanceLoaded?.(unit);
  };
  useEffect(() => {
    if (unitInstance) {
      return unitInstance.subscribeViewSize(setUnitViewSize);
    }
  }, [unitInstance]);

  const scale = useMemo(() => {
    const innerSize = unitViewSize;
    if (outerSize && innerSize) {
      const minMaxFn = fitMode === "contain" ? Math.min : Math.max;
      const scale = minMaxFn(
        outerSize.width / innerSize.width,
        outerSize.height / innerSize.height,
      );
      // console.log(unitId, outerSize, innerSize, scale);
      return scale;
    } else {
      return 1;
    }
  }, [outerSize, unitViewSize]);

  const styleScalerDivSize = useMemo(() => {
    if (unitViewSize) {
      const { width, height, preferJustSize } = unitViewSize;
      if (preferJustSize) {
        return { width: `${width}px`, height: `${height}px` };
      } else {
        return { width: `${100 / scale}%`, height: `${100 / scale}%` };
      }
    }
  }, [unitViewSize, scale]);

  return (
    <div
      ref={outerDivRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          // width: `${100 / scale}%`,
          // height: `${100 / scale}%`,
          width: styleScalerDivSize?.width,
          height: styleScalerDivSize?.height,
          transform: `scale(${scale})`,
          transformOrigin: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <UnitFrame
          unitId={unitId}
          unitUrl={unitUrl}
          destSpec={destSpec}
          inputNotes={inputNotes}
          onIframeMounted={onIframeMounted}
          onUnitInstanceLoaded={handleUnitInstanceLoaded}
          onLoadFailed={onLoadFailed}
          viewActive={viewActive}
        />
      </div>
    </div>
  );
};
