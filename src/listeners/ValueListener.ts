import { IListener, Printable, ResultCallback } from './listeners.types';

class ValueListener<T extends Printable> implements IListener<T> {
    private _value: T;
    private readonly _callbacks: Map<string, ResultCallback<T>>;

    constructor(value: T) {
        this._value = value;
        this._callbacks = new Map();
    }

    get value(): T {
        return this._value;
    }

    set value(val: T) {
        this._value = val;
        this.makeCallbacks();
    }

    get callbacks(): Map<string, ResultCallback<T>> {
        return this._callbacks;
    }

    private makeCallbacks() {
        for (const callback of this._callbacks.values()) {
            callback(this._value);
        }
    }

    addListener(id: string, callback: ResultCallback<T>) {
        this._callbacks.set(id, callback);
    }

    removeListener(id: string) {
        this._callbacks.delete(id);
    }

    removeAllListeners() {
        this._callbacks.clear();
    }

    toString(): string {
        return this._value.toString();
    }
}

export default ValueListener;
