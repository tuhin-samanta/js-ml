import CanvasUtils from "./utils/canvas/Main.js";
import math from "./utils/canvas/utils/fancyMath.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.height = 500;
canvas.width = 500;

canvas.style.backgroundColor = "#140E4D";

const canvasUtil = new CanvasUtils(canvas, ctx);

// for (let i = 0; i < 20; i++) {
//   const x = math.randomBetween(0, canvas.width);
//   const y = math.randomBetween(0, canvas.height);

//   canvasUtil.circle(x, y, 4).bg("white").update();
// }

// canvasUtil
//   .line(0, 0)
//   .to(100, 100)
//   .to(100, 150)
//   .withAngle(90, 120, { color: "green" })
//   .withAngle(30, 50)
//   .draw();
