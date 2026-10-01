export type ReactPointerEvent = React.PointerEvent<HTMLElement>;

export function getHtmlElementById(id: string) {
  return document.getElementById(id) as HTMLElement;
}
