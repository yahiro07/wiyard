export function renderLog(label: string, ...args: any[]) {
  if ((import.meta as any).env.DEV && 0) {
    console.log(`render ${label}`, ...args);
  }
}
