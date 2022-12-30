import math from "../fancyMath.js";
export default class {
  constructor(
    canvas,
    ctx,
    defaultElementBorderColor = "white",
    defaultElementBackgroundColor = "white",
    defaultLineWidth = 2
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.defaultElementBorderColor = defaultElementBorderColor;
    this.defaultElementBackgroundColor = defaultElementBackgroundColor;
    this.defaultLineWidth = defaultLineWidth;
  }
  degree(val) {
    return (Math.PI / 180) * val;
  }
  radianToDegree(radian) {
    return (180 / Math.PI) * radian;
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
  pointDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  line(startX, startY, endX = null, endY = null) {
    const _this = this;
    const canvas = this.canvas;
    const ctx = this.ctx;
    let width = this.defaultLineWidth;
    let color = this.defaultElementBorderColor;
    const toPoints = [];
    toPoints.push({ x: startX, y: startY, width, color });
    if (endX && endY) {
      toPoints.push({
        x: endX,
        y: endY,
        width,
        color,
      });
    }
    return {
      to(x, y, options = {}) {
        let point = Object.assign(
          { x, y },
          options !== null && options !== void 0 ? options : {}
        );
        toPoints.push(point);
        return this;
      },
      withAngle(angle, length, options = null) {
        let lineStartX = null;
        let lineStartY = null;
        if (toPoints[toPoints.length - 2]) {
          lineStartX = toPoints[toPoints.length - 2].x;
          lineStartY = toPoints[toPoints.length - 2].y;
        }
        const lineEndX = toPoints[toPoints.length - 1].x;
        const lineEndY = toPoints[toPoints.length - 1].y;
        const angleStart =
          lineStartX && lineStartY ? Math.atan2(lineStartY, lineStartX) : null;
        const angleEnd = Math.atan2(lineEndY, lineEndX);
        let extraAngle = 0;
        let remainingAngle = angle;
        if (lineStartX && lineStartY) {
          const rightAngleX = lineStartX;
          const rightAngleY = lineEndY;
          // ctx.beginPath();
          // ctx.moveTo(lineEndX, lineEndY);
          // ctx.strokeStyle = "green";
          // ctx.lineTo(rightAngleX, rightAngleY);
          // ctx.stroke();
          // ctx.closePath();
          const hypp = _this.pointDistance(
            lineStartX,
            lineStartY,
            lineEndX,
            lineEndY
          );
          const altitude = _this.pointDistance(
            lineStartX,
            lineStartY,
            rightAngleX,
            rightAngleY
          );
          extraAngle = _this.radianToDegree(Math.asin(altitude / hypp));
          if (lineEndX === lineStartX) {
            if (lineEndY > lineStartY) {
              remainingAngle = -90 + angle;
            } else if (lineEndY < lineStartY) {
              remainingAngle = angle;
            }
          } else if (lineStartY === lineEndY) {
            remainingAngle = 180 - angle;
          } else if (lineEndX < lineStartX) {
            if (lineEndY < lineStartY) {
              remainingAngle = extraAngle + angle;
            } else if (lineEndY > lineStartY) {
              remainingAngle = angle - extraAngle;
            }
          } else if (lineEndX > lineStartX) {
            if (lineStartY > lineEndY) {
              remainingAngle = 180 - (angle + extraAngle);
            } else if (lineStartY < lineEndY) {
              remainingAngle = 180 + extraAngle - angle;
            }
          }
        }
        let x = lineEndX + Math.cos(_this.degree(remainingAngle)) * length;
        let y = lineEndY + Math.sin(_this.degree(remainingAngle)) * length;
        let point = Object.assign(
          { x, y, angle },
          options !== null && options !== void 0 ? options : {}
        );
        toPoints.push(point);
        console.log({ toPoints });
        return this;
      },
      color(value) {
        color = value;
        return this;
      },
      width(value) {
        width = value;
        return this;
      },
      draw() {
        ctx.beginPath();
        if (toPoints.length > 0) {
          ctx.moveTo(toPoints[0].x, toPoints[0].y);
          toPoints.splice(0, 1);
        }
        toPoints.forEach((point) => {
          var _a, _b;
          ctx.strokeStyle =
            (_a = point.color) !== null && _a !== void 0 ? _a : color;
          ctx.lineWidth =
            (_b = point.width) !== null && _b !== void 0 ? _b : width;
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        });
        ctx.closePath();
        return this;
      },
      update() {
        this.erase();
        this.update();
        return this;
      },
      erase() {
        ctx.save();
      },
    };
  }
  circle(startX, startY, radius) {
    const _this = this;
    const ctx = this.ctx;
    let bg = null;
    let stroke = this.defaultElementBorderColor;
    let lineWidth = this.defaultLineWidth;
    return {
      detail: { startX, startY, radius, bg, border: { color: stroke } },
      bg(color = null) {
        if (color === null) {
          bg = _this.defaultElementBackgroundColor;
        } else if (color === "random") {
          bg = _this.randomColor();
        } else {
          bg = color;
        }
        return this;
      },
      border(size, color = null) {
        lineWidth = size;
        if (color === "random") {
          stroke = _this.randomColor();
        } else if (color) {
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
        let range =
          radius + (lineWidth !== null && lineWidth !== void 0 ? lineWidth : 0);
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
