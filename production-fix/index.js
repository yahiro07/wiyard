//If a critical bug (such like infinite loop or browser crash) is detected in a shared url,
//it's difficult to fix this since the url is tied to the specific build and permanent.
//We try to avoid it by adding the necessary code to this script and pushing to the prod-patch branch.
//The app directly loads this script via jsDeliver, regardless of the version.

function getDeployId() {
  const firstSegment = location.host.split(".")[0];
  return firstSegment === "wireboard" ? "main" : firstSegment;
}

const productionFixes = {
  badVersion123: { isFullyDisabled: true },
  badVersion124: {
    hookProjectData(data) {
      console.log("productionFix hookProjectData", data);

      if (
        data.storeStates.unitItems.some((it) => it.catalogKey === "badUnit012")
      ) {
        data.storeStates.unitItems = data.storeStates.unitItems.filter(
          (it) => it.catalogKey !== "badUnit012",
        );
      }
      if (0 /*some non-recoverable condition cannot load the data */) {
        return "blocked";
      }
    },
  },
};

try {
  const deployId = getDeployId();
  console.log({ deployId });
  window.productionFix = productionFixes[deployId];
} catch (e) {
  console.error(e);
}
