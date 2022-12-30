type EventName = string;
type ListenerID = string;
type EventListenersMap = { [name: string]: number[] };

const events = function () {
  const listeners: (Function | null)[] = [];
  const eventListenersMap: EventListenersMap = {};
  const onceMap: number[] = [];

  let errEventName = "error";

  const execOnAndOnce = function (
    eventName: string,
    callBack: Function,
    once: boolean = false
  ): ListenerID {
    if (typeof eventName !== "string") {
      throw new Error(
        `Event name should be a string, "${typeof eventName}" given`
      );
    } else if (typeof callBack !== "function") {
      throw new Error(
        `callBack should be a function, "${typeof callBack}" given`
      );
    }

    let cbs = eventListenersMap[eventName] ?? [];
    let length = listeners.push(callBack);
    let listenerID = length - 1;
    cbs.push(listenerID);
    eventListenersMap[eventName] = cbs;

    let evtListener = `${listenerID}@${errEventName}`;

    if (once) {
      onceMap.push(listenerID);
    }
    return evtListener;
  };

  return {
    set errorEventName(name: string) {
      errEventName = name;
    },

    once(eventName: string, callBack: Function) {
      return execOnAndOnce(eventName, callBack, true);
    },

    on(eventName: string, callBack: Function): ListenerID {
      return execOnAndOnce(eventName, callBack, false);
    },

    emit(eventName: string, ...args: unknown[]): void {
      let evIds = eventListenersMap[eventName];
      if (evIds && Array.isArray(evIds)) {
        let onceArr: ListenerID[] = [];
        evIds.forEach((ev) => {
          let fn = listeners[ev] as Function;
          if (onceMap.includes(ev)) {
            onceArr.push(`${ev}@${eventName}`);
          }

          if (typeof fn === "function") {
            setTimeout(async () => {
              try {
                await fn();
              } catch (err) {}
            });
          }
        });
        this.removeListener(onceArr);
      }
    },

    removeListener(listenerID: ListenerID | ListenerID[]) {
      let ids = Array.isArray(listenerID) ? listenerID : [listenerID];
      ids.forEach((id) => {
        const [listenerIndexStr, ...eventNameArr] = id.split("@");
        const listenerIndex = Number(listenerIndexStr);
        const eventName = eventNameArr.join("@");

        listeners[listenerIndex] && (listeners[listenerIndex] = null);

        onceMap.includes(listenerIndex) &&
          onceMap.splice(onceMap.indexOf(listenerIndex), 1);

        Array.isArray(eventListenersMap[eventName]) &&
          eventListenersMap[eventName].length > 0 &&
          eventListenersMap[eventName].includes(listenerIndex) &&
          eventListenersMap[eventName].splice(
            eventListenersMap[eventName].indexOf(listenerIndex),
            1
          );
      });
    },

    remove(eventID: string): void {},

    removeAll(eventName: string): void {},
  };
};

export default events;
