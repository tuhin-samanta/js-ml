import math from "../fancyMath.js";

export default class {
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

  line(startX: number, startY: number, endX: number, endY: number) {}

  circle(startX: number, startY: number, radius: number) {
    const _this = this;
    const ctx = this.ctx;

    let bg: null | string = null;
    let stroke: null | string = this.defaultElementBorderColor;
    let lineWidth: null | number = this.defaultLineWidth;

    return {
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
