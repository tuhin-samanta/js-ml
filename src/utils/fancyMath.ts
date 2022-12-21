export default {
  ...Math,

  randomBetween(min: number, max: number) {
    let rand = Math.random();
    return Math.floor(rand * (max - min + 1)) + min;
  },
};
