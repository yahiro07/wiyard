import { useState } from "react";

export function useInstance<T>(fn: () => T) {
  return useState(fn)[0];
}
