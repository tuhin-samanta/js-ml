import CanvasUtils from "../../utils/canvas/Main.js";
const canvas = document.createElement(`canvas`);
canvas.height = 500;
canvas.width = 500;
canvas.style.backgroundColor = "#230e3f";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
const ob = new CanvasUtils(canvas, ctx);
