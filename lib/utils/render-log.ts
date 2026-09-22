export function renderLog(label: string, ...args: any[]) {
  if ((import.meta as any).env.DEV) {
    console.log(`render ${label}`, ...args);
  }
}
