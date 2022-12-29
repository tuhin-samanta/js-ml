type EventID = string;

const events = function () {
  const events = [];

  return {
    on(eventName: string, callBack: Function): EventID {},

    emit(eventName: string, ...args: unknown[]): void {},

    remove(eventID: string): void {},

    removeAll(eventName: string): void {},
  };
};

export default events;
