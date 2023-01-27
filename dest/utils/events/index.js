var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const globalListenStorage = {
    listeners: [],
    eventListenersMap: {},
    onceMap: [],
};
/**
 * Returns the event listener object
 *
 * @param options (Object| Optional) An optional object for additional configuration. For example {global: true}, it will use the global event storage which is helpful for multi component apps to emit and listen events from different component.
 * @returns (Object) Event listener
 */
const events = function (options = {}) {
    const useGlobals = options.global ? true : false;
    const listeners = useGlobals
        ? globalListenStorage.listeners
        : [];
    const eventListenersMap = useGlobals
        ? globalListenStorage.eventListenersMap
        : {};
    const onceMap = useGlobals ? globalListenStorage.onceMap : [];
    let errEventName = "error";
    /**
     * Stores the events and the listeners also determines whether the method will be called once
     *
     * @param eventName (String) The name of the event
     * @param callBack (Function) The callback function
     * @param once (Boolean | Optional) Default false, it determines whether the method will be called once
     * @returns (String) Event Id
     */
    const execOnAndOnce = function (eventName, callBack, once = false) {
        var _a;
        if (typeof eventName !== "string") {
            throw new Error(`Event name should be a string, "${typeof eventName}" given`);
        }
        else if (typeof callBack !== "function") {
            throw new Error(`callBack should be a function, "${typeof callBack}" given`);
        }
        let cbs = (_a = eventListenersMap[eventName]) !== null && _a !== void 0 ? _a : [];
        let length = listeners.push(callBack);
        let listenerID = length - 1;
        cbs.push(listenerID);
        eventListenersMap[eventName] = cbs;
        let evtListener = `${listenerID}@${eventName}`;
        if (once) {
            onceMap.push(listenerID);
        }
        return evtListener;
    };
    return {
        set errorEventName(name) {
            errEventName = name;
        },
        /**
         *
         * @param eventName
         * @param callBack
         * @returns
         */
        once(eventName, callBack) {
            let id = execOnAndOnce(eventName, callBack, true);
            this.emit("newListener", eventName, callBack);
            return id;
        },
        /**
         *
         * @param eventName
         * @param callBack
         * @returns
         */
        on(eventName, callBack) {
            let id = execOnAndOnce(eventName, callBack, false);
            this.emit("newListener", eventName, callBack);
            return id;
        },
        /**
         *
         * @param eventName
         * @param args
         */
        emit(eventName, ...args) {
            let evIds = eventListenersMap[eventName];
            if (evIds && Array.isArray(evIds)) {
                let onceArr = [];
                evIds.forEach((ev) => {
                    let fn = listeners[ev];
                    if (onceMap.includes(ev)) {
                        onceArr.push(`${ev}@${eventName}`);
                    }
                    if (typeof fn === "function") {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                yield fn(...args);
                            }
                            catch (err) {
                                let errListeners = eventListenersMap[errEventName];
                                if (Array.isArray(errListeners) && errListeners.length > 0) {
                                    this.emit(errEventName, err);
                                }
                                else {
                                    throw err;
                                }
                            }
                        }));
                    }
                });
                this.removeAllListenersById(onceArr);
            }
        },
        /**
         *
         * @param listenerID
         * @returns
         */
        removeListenerById(listenerID) {
            return this.removeAllListenersById(listenerID);
        },
        /**
         *
         * @param listenerID
         */
        removeAllListenersById(listenerID) {
            let ids = Array.isArray(listenerID) ? listenerID : [listenerID];
            ids.forEach((id) => {
                const [listenerIndexStr, ...eventNameArr] = id.split("@");
                const listenerIndex = Number(listenerIndexStr);
                const eventName = eventNameArr.join("@");
                Array.isArray(eventListenersMap[eventName]) &&
                    eventListenersMap[eventName].length > 0 &&
                    eventListenersMap[eventName].includes(listenerIndex) &&
                    eventListenersMap[eventName].splice(eventListenersMap[eventName].indexOf(listenerIndex), 1);
                listeners[listenerIndex] && (listeners[listenerIndex] = null);
                onceMap.includes(listenerIndex) &&
                    onceMap.splice(onceMap.indexOf(listenerIndex), 1);
            });
        },
        /**
         *
         * @param eventName
         * @param listener
         * @returns
         */
        off(eventName, listener) {
            return this.removeEventListener(eventName, listener);
        },
        /**
         *
         * @param eventName
         * @param listener
         */
        removeEventListener(eventName, listener) {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                let evtName = `${index}@${eventName}`;
                this.removeListenerById(evtName);
            }
        },
        /**
         *
         * @param eventName
         */
        removeAllEventListeners(eventName) {
            let evtIds = eventListenersMap[eventName];
            if (evtIds && Array.isArray(evtIds)) {
                let handlers = evtIds.map((id) => `${id}@${eventName}`);
                this.removeAllListenersById(handlers);
            }
        },
    };
};
//started testing
export default events;
