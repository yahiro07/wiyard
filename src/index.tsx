import { App } from "@/app";
import "virtual:uno.css";
import "./page.css";
import { mountAppRoot } from "@lib/utils/mount-app-root";
import { appEnvs } from "@/common/app-config";
import { productionFix } from "@/periphery/production-fix-wrapper";
import { AppUnitsDev } from "@/units-dev";
import { appPersistence } from "@/project/app-persistence";

function appPreMount() {
  appPersistence.load();
}

function start() {
  if (appEnvs.isProduction && productionFix?.isFullyDisabled) {
    alert("this version is disabled dut to a potential crash risk.");
    return;
  }
  appPreMount();
  mountAppRoot(<App />);
  window.addEventListener("contextmenu", (e) => e.preventDefault());
}

function startDev() {
  mountAppRoot(<AppUnitsDev />);
  window.addEventListener("contextmenu", (e) => e.preventDefault());
}

if (appEnvs.isDevelopment && location.search.includes("unit-dev")) {
  startDev();
} else {
  start();
}
