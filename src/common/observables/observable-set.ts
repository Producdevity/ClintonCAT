import BaseObservable from '@/common/observables/internal/base-observable';
import { IObservable } from '@/common/observables/internal/observable.types';
import { Printable } from '@/utils/types';
import SortedCollection from './internal/sorted-collection';

class ObservableSet<T extends Printable> extends BaseObservable<T[]> implements IObservable<T[]> {
    private _seen: Set<T>;
    private _collection: SortedCollection<T>;

    constructor(...values: T[]) {
        super();
        this._collection = new SortedCollection(...values);
        this._seen = new Set(this._collection.value);
    }

    get value(): T[] {
        return this._collection.value;
    }

    set value(val: T[]) {
        this._collection.value = val;
        this._seen = new Set(val);
        this.notifyListeners(this.value);
    }

    add(elem: T): void {
        if (!this._seen.has(elem)) {
            this._collection.add(elem);
            this._seen.add(elem);
            this.notifyListeners(this.value);
        }
    }

    deleteAt(index: number): void {
        this._seen.delete(this.value[index]);
        this._collection.deleteAt(index);
        this.notifyListeners(this.value);
    }

    delete(elem: T): void {
        this._seen.delete(elem);
        if (this._collection.delete(elem)) {
            this.notifyListeners(this.value);
        }
    }

    toString(): string {
        return this._collection.value.toString();
    }
}

export default ObservableSet;
