export type Callback = (err: Error | null, val: string | null) => void;

class MockAsyncStorage {
    store: Map<string, string | null>;

    constructor() {
        this.store = new Map();
    }

    getItem = jest.fn(async (k: string, cb?: Callback): Promise<string | null> => {
        const val = this.store.get(k) || null;
        if (cb) cb(null, val);
        return Promise.resolve(val);
    });

    setItem = jest.fn(async (k: string, v: string, cb?: Callback): Promise<void> => {
        this.store.set(k, v);
        if (cb) cb(null, v);
        return Promise.resolve()
    });
}

export default MockAsyncStorage;
