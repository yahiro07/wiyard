export function createCanvasShapeDrawing(ctx: CanvasRenderingContext2D) {
  return {
    drawLine(x1: number, y1: number, x2: number, y2: number) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    fillCircle(cx: number, cy: number, r: number) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fill();
    },
  };
}
