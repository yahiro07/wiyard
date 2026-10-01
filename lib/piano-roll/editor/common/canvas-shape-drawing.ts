export function createCanvasShapeDrawing(ctx: CanvasRenderingContext2D) {
  return {
    fillCircle(cx: number, cy: number, r: number) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fill();
    },
  };
}
