import { ReactNode } from "react";
import { createRoot, Root } from "react-dom/client";

type RootElement = HTMLElement & { __reactRoot: Root };

export function mountAppRoot(rootNode: ReactNode, rootElementId = "app") {
  const appDiv = document.getElementById(rootElementId) as RootElement;
  appDiv.__reactRoot ??= createRoot(appDiv);
  appDiv.__reactRoot.render(rootNode);
}
