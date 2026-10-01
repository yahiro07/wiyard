import "virtual:uno.css";
import "./page.css";
import { mountAppRoot } from "@lib/utils/mount-app-root";
import { AppUnitsDev } from "@/units-dev";

function suppressBrowserDefaultHandlers() {
  window.addEventListener("contextmenu", (e) => e.preventDefault());
  window.addEventListener("dragstart", (e) => {
    if (e.target instanceof HTMLImageElement) e.preventDefault();
  });
}

function startDev() {
  mountAppRoot(<AppUnitsDev />);
  suppressBrowserDefaultHandlers();
}

if (import.meta.env.DEV) {
  startDev();
} else {
  const appDiv = document.getElementById("app");
  if (appDiv) {
    appDiv.innerHTML = "This page is only available in development mode.";
  }
}
