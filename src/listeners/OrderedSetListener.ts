import SortedArray from './SortedArray';
import { IListener, Printable, ResultCallback } from './listeners.types';

class OrderedSetListener<T extends Printable> implements IListener<T[]> {
    private _seen: Set<T>;
    private _value: SortedArray<T>;
    private readonly _callbacks: Map<string, ResultCallback<T[]>>;

    constructor(...values: T[]) {
        this._value = new SortedArray(...values);
        this._seen = new Set(this._value.value);
        this._callbacks = new Map();
    }

    get value(): T[] {
        return this._value.value;
    }

    set value(val: T[]) {
        this._value.value = val;
        this._seen = new Set(val);
        this.makeCallbacks();
    }

    get callbacks(): Map<string, ResultCallback<T[]>> {
        return this._callbacks;
    }

    add(elem: T) {
        if (!this._seen.has(elem)) {
            this._value.add(elem);
            this._seen.add(elem);
            this.makeCallbacks();
        }
    }

    deleteAt(index: number) {
        this._seen.delete(this.value[index]);
        this._value.deleteAt(index);
        this.makeCallbacks();
    }

    delete(elem: T) {
        this._seen.delete(elem);
        if (this._value.delete(elem)) {
            this.makeCallbacks();
        }
    }

    private makeCallbacks() {
        for (const callback of this._callbacks.values()) {
            callback(this.value);
        }
    }

    addListener(id: string, callback: ResultCallback<T[]>) {
        this._callbacks.set(id, callback);
    }

    removeListener(id: string) {
        this._callbacks.delete(id);
    }

    removeAllListeners() {
        this._callbacks.clear();
    }

    toString(): string {
        return this._value.value.toString();
    }
}

export default OrderedSetListener;
