import math from "../fancyMath.js";
export default class {
    constructor(canvas, ctx, defaultElementBorderColor = "white", defaultElementBackgroundColor = "white", defaultLineWidth = 2) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.defaultElementBorderColor = defaultElementBorderColor;
        this.defaultElementBackgroundColor = defaultElementBackgroundColor;
        this.defaultLineWidth = defaultLineWidth;
    }
    degree(val) {
        return (Math.PI / 180) * val;
    }
    randomColor(opacity = 1) {
        let arr = [
            math.randomBetween(0, 255),
            math.randomBetween(0, 255),
            math.randomBetween(0, 255),
        ];
        let color = `rgb(${arr.join(",")})`;
        return color;
    }
    clear(startX = null, startY = null, endX = null, endY = null) {
        for (let i of arguments) {
            if (i === null) {
                startX = 0;
                startY = 0;
                endX = this.canvas.width;
                endY = this.canvas.height;
                break;
            }
        }
        this.ctx.clearRect(startX, startY, endX, endY);
    }
    line(startX, startY, endX, endY) { }
    circle(startX, startY, radius) {
        const _this = this;
        const ctx = this.ctx;
        let bg = null;
        let stroke = this.defaultElementBorderColor;
        let lineWidth = this.defaultLineWidth;
        return {
            bg(color = null) {
                if (color === null) {
                    bg = _this.defaultElementBackgroundColor;
                }
                else if (color === "random") {
                    bg = _this.randomColor();
                }
                else {
                    bg = color;
                }
                return this;
            },
            border(size, color = null) {
                lineWidth = size;
                if (color === "random") {
                    stroke = _this.randomColor();
                }
                else if (color) {
                    stroke = color;
                }
                return this;
            },
            borderColor(color) {
                this.border(lineWidth, color);
            },
            draw() {
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                if (stroke) {
                    ctx.strokeStyle = stroke;
                }
                if (lineWidth) {
                    ctx.lineWidth = lineWidth;
                }
                ctx.arc(startX, startY, radius, _this.degree(0), _this.degree(360));
                if (!bg || stroke) {
                    ctx.stroke();
                }
                if (bg) {
                    ctx.fillStyle = bg;
                    ctx.fill();
                }
                ctx.closePath();
                return this;
            },
            erase() {
                let range = radius + (lineWidth !== null && lineWidth !== void 0 ? lineWidth : 0);
                ctx.save();
                ctx.beginPath();
                ctx.arc(startX, startY, range, _this.degree(0), _this.degree(360));
                ctx.clip();
                ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                ctx.closePath();
                ctx.restore();
            },
            update() {
                this.erase();
                this.draw();
                return this;
            },
            showDetail(showRadius = false) {
                let txt = showRadius
                    ? `{x: ${startX}, y: ${startY}, r: ${radius}}`
                    : `(${startX} , ${startY})`;
            },
        };
    }
}
