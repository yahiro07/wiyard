import { store } from "@/store/store";

export const ErrorDialog = ({
  message,
  closeCallback,
}: {
  message: string;
  closeCallback?: () => void;
}) => {
  const handleOkButton = () => {
    closeCallback?.();
    store.setProjectLoadErrorStatus(null);
  };
  return (
    <div className="absolute-full bg-black/50 flex-c z-999">
      <div className="bg-white w-400px min-h-200px flex-v">
        <h3 className="bg-gray-400 px-2 py-1">Error</h3>
        <div className="bg-gray-200 p-2 pb-4 grow flex-v gap-2">
          <div className="grow">{message}</div>
          <div className="flex-c">
            <button
              className="w-80px bg-gray-400 text-white"
              type="button"
              onClick={handleOkButton}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
