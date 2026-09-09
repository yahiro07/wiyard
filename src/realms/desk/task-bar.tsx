import { windowSystem } from "@/store/store";
import { cz } from "@/utils/cz";

export const TaskBar = () => {
  const baseClass =
    "absolute left-0 w-full flex-c min-h-40px cursor-pointer bg-gray-300/50";
  return (
    <>
      {true && (
        <div
          className={cz(baseClass, "top-0")}
          onClick={windowSystem.toggleEvacuate}
        />
      )}
      {false && (
        <div
          className={cz(baseClass, "bottom-0")}
          onClick={windowSystem.toggleEvacuate}
        />
      )}
    </>
  );
};
