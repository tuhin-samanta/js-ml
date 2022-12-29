type StoreID = string;
type WatcherFunction = (kenewValue: unknown) => void;
interface MapType {
  [key: string]: number;
}

const createStorage = function () {
  let forceSet = false;
  let dataIndex = -1;
  const data = [];
  const map: MapType = {};
  const subscriptions = [] as Function[];
  const watchers = [] as Function[];

  function processSubscriptions() {
    subscriptions.forEach((s) => {
      setTimeout(() => {
        s();
      });
    });
  }

  return {
    add(data: unknown): StoreID {
      let key = dataIndex + 1;
      return this.set(dataIndex, data);
    },

    set(key: string | number, val: unknown = undefined): StoreID {
      key = key.toString();
      if (map[key] !== undefined) {
      }
    },

    update(key: string | unknown, val: unknown = undefined): boolean {},

    delete(key: string | unknown, hard: boolean = false): boolean {},

    restore(key: string | unknown): boolean {},

    subscribe(cb: Function) {
      this.subscriptions.push(cb);
    },
  };
};

export default createStorage;
