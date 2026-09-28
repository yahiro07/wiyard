import { dequal } from "dequal";
import { appPersistence, PersistenceData } from "@/project/app-persistence";
import { store } from "@/store/store";

function createAutoPersistenceTask() {
  let latestData: PersistenceData | undefined;

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

  return {
    setup() {
      if (!store.state.autoPersistenceEnabled) return;
      latestData = appPersistence.emitPersistenceData();

      const timerId = setInterval(() => {
        internal.ensureLatestSaved();
      }, 5 * 1000);
      return () => clearInterval(timerId);
    },
    ensureLatestSaved() {
      if (!store.state.autoPersistenceEnabled) return;
      internal.ensureLatestSaved();
    },
  };
}

export const autoPersistenceTask = createAutoPersistenceTask();
