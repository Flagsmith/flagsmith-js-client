interface EventCallback {
    id: string;
    fn: () => void;
    ctx?: any;
}

type EventName = string;

interface EventMap {
    [eventName: string]: EventCallback[];
}

class Emitter {
    private e: EventMap = {};

    private generateCallbackId(): string {
        return Math.random().toString(36).substring(7);
    }

    on(name: EventName, callback: () => void, ctx?: any): () => this {
        const e = this.e || (this.e = {});
        const id = this.generateCallbackId();

        const listener = {
            id: id,
            fn: callback,
            ctx: ctx
        };

        (e[name] || (e[name] = [])).push(listener);

        const offFunction = () => {
            this.off(name, id);
        };

        return offFunction.bind(this) as () => this;
    }

    once(
        name: string, // EventName inlined as string
        callback: (...args: any[]) => void,
        ctx?: any
    ): () => this {
        const self = this;
        const id = this.generateCallbackId();

        function listener(this: unknown, ...args: any[]) {
            self.off(name, id);
            callback.apply(ctx, args);
        }

        (listener as any)._ = callback;

        return this.on(name, listener, ctx) as () => this;
    }

    emit(name: EventName, ...data: any[]): this {
        const evtArr = ((this.e || (this.e = {}))[name] || []).slice();
        const len = evtArr.length;

        for (let i = 0; i < len; i++) {
            evtArr[i].fn.apply(evtArr[i].ctx, data as any);
        }

        return this;
    }

    off(name: EventName, callbackOrId?: (() => void) | string, ctx?: any): this {
        const e = this.e || (this.e = {});
        const evts = e[name];
        const liveEvents: EventCallback[] = [];

        if (evts && callbackOrId) {
            for (let i = 0, len = evts.length; i < len; i++) {
                if (
                    (typeof callbackOrId === 'function' && evts[i].fn !== callbackOrId) ||
                    (typeof callbackOrId === 'string' && evts[i].id !== callbackOrId)
                ) {
                    liveEvents.push(evts[i]);
                }
            }
        }

        (liveEvents.length ? e[name] = liveEvents : delete e[name]);

        return this;
    }
}

export default Emitter;
