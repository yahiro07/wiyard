import { App } from "@/app";
import "virtual:uno.css";
import "./page.css";
import { persistence } from "@/store/persistence";
import { mountAppRoot } from "@/utils/mount-app-root";

if (0) {
  persistence.load();
}
mountAppRoot(<App />);
