import CanvasUtils from "./utils/canvas/Common.js";
import math from "./utils/fancyMath.js";
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.height = 600;
canvas.width = 600;
canvas.style.backgroundColor = "#140E4D";
const canvasUtil = new CanvasUtils(canvas, ctx);

// for (let i = 0; i < 20; i++) {
//   const x = math.randomBetween(0, canvas.width);
//   const y = math.randomBetween(0, canvas.height);
//   canvasUtil.circle(x, y, 4).bg("white").update();
// }

// canvasUtil.circle(100, 200, 60).bg("random").border("8", "white").draw();

// canvasUtil
//   .line(400, 100)
//   .to(100, 200)
//   .withAngle(90, 50)
//   .withAngle(30, 80)
//   .draw();
