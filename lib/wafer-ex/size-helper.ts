export type Size = { width: number; height: number };

export const makeSize = (width: number, height: number): Size => ({
  width,
  height,
});

export function observeElementSize(
  el: HTMLElement,
  callback: (size: Size) => void,
) {
  const updateSize = () => {
    callback(makeSize(el.offsetWidth, el.offsetHeight));
  };
  const ro = new ResizeObserver(updateSize);
  ro.observe(el);
  return () => ro.disconnect();
}
