import { mountAppRoot } from "@/utils/mount-app-root";
import "virtual:uno.css";

const App = () => {
  return <div className="text-red-500">hello</div>;
};

mountAppRoot(<App />);
