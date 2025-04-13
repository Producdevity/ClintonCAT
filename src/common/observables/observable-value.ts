import BaseObservable from '@/common/observables/internal/base-observable';
import { IObservable } from '@/common/observables/internal/observable.types';
import { Printable } from '@/utils/types';

class ObservableValue<T extends Printable> extends BaseObservable<T> implements IObservable<T> {
    private _value: T;

    constructor(value: T) {
        super();
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    set value(val: T) {
        this._value = val;
        this.notifyListeners(this._value);
    }

    toString(): string {
        return this._value.toString();
    }
}

export default ObservableValue;
