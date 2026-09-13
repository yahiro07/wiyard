import { App } from "@/app";
import "virtual:uno.css";
import "./page.css";
import { mountAppRoot } from "@lib/utils/mount-app-root";
import { persistence } from "@/store/persistence";

persistence.load();
mountAppRoot(<App />);
window.addEventListener("contextmenu", (e) => e.preventDefault());
