import CanvasUtils from "./utils/canvas/Common.js";
import math from "./utils/fancyMath.js";
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.height = 600;
canvas.width = 600;
canvas.style.backgroundColor = "#140E4D";
const canvasUtil = new CanvasUtils(canvas, ctx);
for (let i = 0; i < 20; i++) {
  const x = math.randomBetween(0, canvas.width);
  const y = math.randomBetween(0, canvas.height);
  canvasUtil.circle(x, y, 4).bg("white").update();
}

// canvasUtil
//     .line(0, 0)
//     .to(100, 100)
//     .to(100, 150)
//     .withAngle(90, 120, { color: "green" })
//     .withAngle(30, 50)
//     .draw();

canvasUtil.circle(150, 300, 40).bg("transparent").border(8, "white").draw();

canvasUtil
  .line(40, 200)
  .to(500, 200)
  .withAngle(90, 80)
  .withAngle(30, 50)
  .width()
  .draw();
