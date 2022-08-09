// Forked originally from https://github.com/zoli-fischer/event-trigger/blob/master/src/EventTrigger.js

type EventParams<T> = {bubbles?:boolean,cancelable?:boolean,detail?:T}

const assign = (...args) => {
    const result = args.reduce((accumulator, currentValue) => {
        if (typeof currentValue === 'object') {
            Object.keys(currentValue).forEach(k => {
                accumulator[k] = currentValue[k];
            });
        }
        return accumulator;
    }, {});
    return result;
};

export default class EventTrigger {
    ____callbacks = []
    constructor() {
        this.____callbacks = [];
    }

    on(event, fn, one = false) {
        const events = event.split(' ');
        if (events.length > 1) {
            events.forEach(eventSplit => {
                this.on(eventSplit, fn, one);
            });
        } else {
            if (typeof this.____callbacks[event] === 'undefined') {
                this.____callbacks[event] = [];
            }
            const onefn = function(...args) { // eslint-disable-line func-names
                if (typeof fn === 'function') {
                    fn.apply(this, args);
                    const index = this.____callbacks[event].indexOf(onefn);
                    if (index > -1) {
                        this.____callbacks[event].splice(index, 1);
                    }
                }
            }
            this.____callbacks[event].push(one ? onefn : fn);
        }
        return this;
    }

    one(event, fn) {
        this.on(event, fn, true);
    }


    off(event:string, fn) {

            const events = event.split(' ');
            if (events.length > 1) {
                events.forEach(eventSplit => {
                    this.off(eventSplit, fn);
                });
            } else if (typeof this.____callbacks[event] !== 'undefined') {
                if (typeof fn !== 'undefined') {
                    const index = this.____callbacks[event].indexOf(fn);
                    if (index > -1) {
                        this.____callbacks[event].splice(index, 1);
                    }
                } else {
                    this.____callbacks[event] = [];
                }
            }

        return this;
    }

    trigger(...args) {
        if (args.length > 0) {
            let event;
            if (typeof args[0] === 'object') {
                let { type } = args[0];
                let originalEvent = args[0];
                if (args[0] instanceof Array) {
                    type = args[0][0];
                    originalEvent = args[0][1];
                }
                event = EventTrigger.CustomEvent(type, {
                    bubbles: false,
                    cancelable: false,
                });
                event.originalEvent = originalEvent;
            } else {
                event = EventTrigger.CustomEvent(args[0], {
                    bubbles: false,
                    cancelable: false,
                });
                event.originalEvent = null;
            }
            if (typeof this.____callbacks[event.type] !== 'undefined') {
                args.shift();
                args.unshift(event);
                this.____callbacks[event.type].forEach(fn => {
                    fn.apply(this, args);
                });
            }
        }
        return this;
    }

    static CustomEvent<T>(type, params:EventParams<T> = {}) {
        params = assign({ bubbles: false, cancelable: false, detail: undefined }, params);
        if (typeof window !== 'undefined') {
            if (typeof window.CustomEvent === 'function') {
                return new window.CustomEvent(type, params);
            }

            const CustomEvent = (type_, params_:EventParams<T> = {}) => {
                const event = document.createEvent('CustomEvent');
                event.initCustomEvent(type, params_.bubbles, params_.cancelable, params_.detail);
                return event;
            };
            CustomEvent.prototype = window.Event.prototype;
            return CustomEvent(type, params);
        }
        return assign({ type, originalEvent: null }, params);
    }
}
