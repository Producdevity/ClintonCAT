class SortedArray<T> {
    private _values: T[] = [];

    constructor(...values: T[]) {
        this.value = values;
    }

    private _searchIndex(value: T): number {
        let l = 0;
        let r = this._values.length;
        while (l < r) {
            const mid = ((l + r) / 2) >> 0;
            if (value === this._values[mid]) {
                return mid;
            } else if (value < this._values[mid]) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return r;
    }

    get length(): number {
        return this._values.length;
    }

    get value(): T[] {
        return this._values;
    }

    set value(values: T[]) {
        this._values = values;
        this._values.sort();
    }

    add(value: T) {
        const idx = this._searchIndex(value);
        this._values.splice(idx, 0, value);
    }

    deleteAt(i: number) {
        this._values.splice(i, 1);
    }

    delete(value: T): boolean {
        const idx = this._searchIndex(value);
        if (this._values[idx] == value) {
            this.deleteAt(idx);
            return true;
        }
        return false;
    }

    clear() {
        this._values = [];
    }
}

export default SortedArray;
