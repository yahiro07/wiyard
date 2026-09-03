import { App } from "@/ui/app";
import "virtual:uno.css";
import "./page.css";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("app")!;
const root = createRoot(rootElement);
root.render(<App />);
