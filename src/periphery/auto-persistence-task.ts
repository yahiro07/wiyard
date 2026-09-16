import { dequal } from "dequal";
import { appPersistence } from "@/project/app-persistence";
import { store } from "@/store/store";

export function setupAutoPersistenceTask() {
  if (!store.state.autoPersistenceEnabled) return;

  let latestData = appPersistence.emitPersistenceData();
  const internal = {
    ensureLatestSaved() {
      const st = store.state;
      if (st.projectLoading || st.projectLoadErrorStatus) return;
      const data = appPersistence.emitPersistenceData();
      if (!dequal(data, latestData)) {
        appPersistence.save(data);
        latestData = data;
      }
    },
  };
  const timerId = setInterval(() => {
    internal.ensureLatestSaved();
  }, 5 * 1000);
  return () => clearInterval(timerId);
}
