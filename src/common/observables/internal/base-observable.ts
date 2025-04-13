import { IObservable, ResultCallback } from '@/common/observables/internal/observable.types';

abstract class BaseObservable<T> implements IObservable<T> {
    protected _callbacks = new Map<string, ResultCallback<T>>();

    abstract get value(): T;
    abstract set value(val: T);

    addListener(id: string, callback: ResultCallback<T>): void {
        this._callbacks.set(id, callback);
    }

    removeListener(id: string): void {
        this._callbacks.delete(id);
    }

    removeAllListeners(): void {
        this._callbacks.clear();
    }

    protected notifyListeners(value: T): void {
        for (const callback of this._callbacks.values()) {
            callback(value);
        }
    }
}

export default BaseObservable;
