type CustomUnit = {
  inputNode?: AudioNode;
  outputNode: AudioNode;
};

type IUnit = AudioNode | CustomUnit;

export function disconnectNodes(...units: IUnit[]) {
  let unit = units[0];
  for (let i = 1; i < units.length; i++) {
    const nextUnit = units[i];
    const src = "outputNode" in unit ? unit.outputNode : unit;
    const dest = (
      "inputNode" in nextUnit ? nextUnit.inputNode : nextUnit
    ) as AudioNode;
    if (src && dest) {
      src.disconnect(dest);
    }
    unit = nextUnit;
  }
}

export function connectNodes(...units: IUnit[]) {
  let unit = units[0];
  for (let i = 1; i < units.length; i++) {
    const nextUnit = units[i];
    const src = "outputNode" in unit ? unit.outputNode : unit;
    const dest = (
      "inputNode" in nextUnit ? nextUnit.inputNode : nextUnit
    ) as AudioNode;
    if (src && dest) {
      src.connect(dest);
    }
    unit = nextUnit;
  }
  return () => {
    disconnectNodes(...units);
  };
}

export function createConnectionKeeper() {
  let disconnectFn: (() => void) | undefined;
  return {
    connects(...units: IUnit[]) {
      disconnectFn?.();
      disconnectFn = connectNodes(...units);
    },
    cleanup() {
      disconnectFn?.();
      disconnectFn = undefined;
    },
  };
}
