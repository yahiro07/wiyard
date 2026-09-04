export const appConfig = {
  isDevelopment: import.meta.env.DEV,
  evacuateWindowsOnTapDesk: false,
  shareWindowCoordForUnits: false,
};
if (1) {
  Object.assign(appConfig, {
    evacuateWindowsOnTapDesk: false,
    shareWindowCoordForUnits: true,
  });
}
