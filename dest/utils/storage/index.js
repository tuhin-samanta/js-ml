const createStorage = function () {
    let forceSet = false;
    let dataIndex = -1;
    const data = [];
    const map = {};
    const subscriptions = [];
    const watchers = [];
    function processSubscriptions() {
        subscriptions.forEach((s) => {
            setTimeout(() => {
                s();
            });
        });
    }
    return {
        add(data) {
            let key = dataIndex + 1;
            return this.set(dataIndex, data);
        },
        set(key, val = undefined) {
            key = key.toString();
            if (map[key] !== undefined) {
            }
        },
        update(key, val = undefined) { },
        delete(key, hard = false) { },
        restore(key) { },
        subscribe(cb) {
            this.subscriptions.push(cb);
        },
    };
};
export default createStorage;
