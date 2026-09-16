import { App } from "@/app";
import "virtual:uno.css";
import "./page.css";
import { mountAppRoot } from "@lib/utils/mount-app-root";
import { appEnvs } from "@/common/app-config";
import { productionFix } from "@/periphery/production-fix-wrapper";
import { appPersistence } from "@/project/app-persistence";

function start() {
  if (appEnvs.isProduction && productionFix?.isFullyDisabled) {
    alert("this version is disabled dut to a potential crash risk.");
    return;
  }
  appPersistence.load();
  mountAppRoot(<App />);
  window.addEventListener("contextmenu", (e) => e.preventDefault());
}
start();
