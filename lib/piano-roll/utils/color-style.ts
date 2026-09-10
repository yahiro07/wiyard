//bg-#abc #bd-def
export function colorStyle(spec: string | { bg?: string; bd?: string }) {
  if (typeof spec === "string") {
    const obj: Record<string, string> = {};
    const segments = spec.split(" ");
    for (const seg of segments) {
      if (seg.startsWith("bg-")) {
        Object.assign(obj, { background: seg.slice(3) });
      } else if (seg.startsWith("bd-")) {
        Object.assign(obj, {
          border: `${seg.slice(3)} solid 1px`,
        });
      }
    }
    return obj;
  } else {
    return {
      background: spec.bg ? spec.bg : undefined,
      border: spec.bd ? `${spec.bd} solid 1px` : undefined,
    };
  }
}
