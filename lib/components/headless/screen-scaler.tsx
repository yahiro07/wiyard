import { useWindowSize } from "../../utils/use-window-size";

export const ScreenScaler = ({
  children,
  scaling,
}: {
  children: React.ReactNode;
  scaling: number;
}) => {
  const size = useWindowSize();
  return (
    <div className="w-dvw h-dvh">
      <div
        style={{
          width: size.width / scaling,
          height: size.height / scaling,
          transform: `scale(${scaling})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
};
