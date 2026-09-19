import { FallbackProps } from "react-error-boundary";

export const FallbackRender = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  console.warn("error occurred in react rendering");
  console.warn(error);
  return (
    <div style={{ padding: "16px" }}>
      <p>Something went wrong.</p>
      <pre>{(error as any)?.message ?? error?.toString()}</pre>
      <div className="flex-h gap-2">
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="bg-#ccc p-1 cursor-pointer"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-#ccc p-1 cursor-pointer"
        >
          Reload
        </button>
        <button
          type="button"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-#ccc p-1 cursor-pointer"
        >
          delete local storage and reload
        </button>
      </div>
    </div>
  );
};
