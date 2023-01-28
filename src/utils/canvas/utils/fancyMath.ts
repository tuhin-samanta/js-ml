export default {
  ...Math,

  randomBetween(min: number, max: number) {
    let rand = Math.random();
    return Math.floor(rand * (max - min + 1)) + min;
  },

  map(
    currentVal: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number
  ) {
    currentVal = Number(currentVal);
    fromMin = Number(fromMin); //?
    fromMax = Number(fromMax);
    toMin = Number(toMin);
    toMax = Number(toMax);

    let current = currentVal;
    if (current < fromMin) {
      current = fromMin;
    } else if (current > fromMax) {
      current = fromMax;
    }

    const fromAvg = (fromMin + fromMax) / 2;
    const toAvg = (toMin + toMax) / 2;

    let arr = [
      { from: fromMin, to: toMin },
      { from: fromMax, to: toMax },
    ];

    const top = arr.reduce((ac, current) => {
      ac += (current.from - fromAvg) * (current.to - toAvg); //?
      return ac;
    }, 0);

    const bottom = arr.reduce((ac, current) => {
      ac += Math.pow(current.from - fromAvg, 2);
      return ac;
    }, 0);

    const m = top / bottom; //?

    const b = toAvg - m * fromAvg; //?

    const val = (m * current + b).toFixed(2);
    return Number(val);
  },
};
