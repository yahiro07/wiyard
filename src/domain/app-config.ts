export const appConfig = {
  isDevelopment: import.meta.env.DEV,
  evacuateWindowsOnTapDesk: false,
  supportAutomationPorts: false,
};
if (1) {
  Object.assign(appConfig, {
    evacuateWindowsOnTapDesk: false,
  });
}
