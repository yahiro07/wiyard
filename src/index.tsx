import { App } from "@/app";
import "virtual:uno.css";
import "./page.css";
import { mountAppRoot } from "@lib/utils/mount-app-root";
import { productionFix } from "@/periphery/production-fix-wrapper";
import { AppUnitsDev } from "@/units-dev";
import { appPersistence } from "@/project/app-persistence";
import { appEnvs } from "@/common/app-envs";

function appPreMount() {
  appPersistence.load();
}

function suppressBrowserDefaultHandlers() {
  window.addEventListener("contextmenu", (e) => e.preventDefault());
  window.addEventListener("dragstart", (e) => {
    if (e.target instanceof HTMLImageElement) e.preventDefault();
  });
}

function start() {
  if (appEnvs.isProduction && productionFix?.isFullyDisabled) {
    alert("this version is disabled dut to a potential crash risk.");
    return;
  }
  appPreMount();
  mountAppRoot(<App />);
  suppressBrowserDefaultHandlers();
}

function startDev() {
  mountAppRoot(<AppUnitsDev />);
  suppressBrowserDefaultHandlers();
}

if (appEnvs.isDevelopment && location.search.includes("unit-dev")) {
  startDev();
} else {
  start();
}
