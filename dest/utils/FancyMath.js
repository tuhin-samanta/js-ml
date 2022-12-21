export default Object.assign(Object.assign({}, Math), { randomBetween(min, max) {
        let rand = Math.random();
        return Math.floor(rand * (max - min + 1)) + min;
    } });
