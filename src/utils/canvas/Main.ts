import type {
  LineToFieldOptions,
  LineToPointsProperties,
  LineDetailOptions,
} from "../../type/index.js";

import math from "./utils/fancyMath.js";

export default class {
  #points = [];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly defaultElementBorderColor: string = "white",
    private readonly defaultElementBackgroundColor: string = "white",
    private readonly defaultLineWidth: number = 2
  ) {}

  degree(val: number) {
    return (Math.PI / 180) * val;
  }

  radianToDegree(radian: number) {
    return (180 / Math.PI) * radian;
  }

  randomColor(opacity: number = 1) {
    let arr = [
      math.randomBetween(0, 255),
      math.randomBetween(0, 255),
      math.randomBetween(0, 255),
    ];

    let color = `rgb(${arr.join(",")})`;
    return color;
  }

  clear(
    startX: number | null = null,
    startY: number | null = null,
    endX: number | null = null,
    endY: number | null = null
  ) {
    for (let i of arguments) {
      if (i === null) {
        startX = 0;
        startY = 0;
        endX = this.canvas.width;
        endY = this.canvas.height;
        break;
      }
    }

    this.ctx.clearRect(
      startX as number,
      startY as number,
      endX as number,
      endY as number
    );
  }

  pointDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  line(
    startX: number,
    startY: number,
    endX: number | null = null,
    endY: number | null = null
  ) {
    const _this = this;
    const canvas = this.canvas;
    const ctx = this.ctx;

    let width = this.defaultLineWidth;
    let color = this.defaultElementBorderColor;

    const toPoints: LineToPointsProperties[] = [];

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
      to(x: number, y: number, options: LineToFieldOptions | null = {}) {
        let point = { x, y, ...(options ?? {}) };
        toPoints.push(point);
        return this;
      },

      withAngle(
        angle: number,
        length: number,
        options: LineToFieldOptions | null = null
      ) {
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

        let point = { x, y, angle, ...(options ?? {}) };
        toPoints.push(point);

        console.log({ toPoints });

        return this;
      },

      color(value: string) {
        color = value;
        return this;
      },

      width(value: number) {
        width = value;
        return this;
      },

      showDetail(options: LineDetailOptions = {}) {
        const data = {
          showPoint: options.showPoint ?? true,
          showPointName: options.showPointName ?? true,
          showDistance: options.showDistance ?? true,
          showAngle: options.showAngle ?? true,
        };
      },

      draw() {
        ctx.beginPath();

        if (toPoints.length > 0) {
          ctx.moveTo(toPoints[0].x, toPoints[0].y);
          toPoints.splice(0, 1);
        }

        toPoints.forEach((point) => {
          ctx.strokeStyle = point.color ?? color;
          ctx.lineWidth = point.width ?? width;
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

  circle(startX: number, startY: number, radius: number) {
    const _this = this;
    const ctx = this.ctx;

    let bg: null | string = null;
    let stroke: null | string = this.defaultElementBorderColor;
    let lineWidth: null | number = this.defaultLineWidth;

    return {
      detail: { startX, startY, radius, bg, border: { color: stroke } },

      bg(color: string | null = null) {
        if (color === null) {
          bg = _this.defaultElementBackgroundColor;
        } else if (color === "random") {
          bg = _this.randomColor();
        } else {
          bg = color;
        }
        return this;
      },

      border(size: number, color: string | null = null) {
        lineWidth = size;
        if (color === "random") {
          stroke = _this.randomColor();
        } else if (color) {
          stroke = color;
        }
        return this;
      },

      borderColor(color: string) {
        this.border(lineWidth as number, color);
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
        let range = radius + (lineWidth ?? 0);
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

      showDetail(showRadius: boolean = false) {
        let txt = showRadius
          ? `{x: ${startX}, y: ${startY}, r: ${radius}}`
          : `(${startX} , ${startY})`;
      },
    };
  }
}
