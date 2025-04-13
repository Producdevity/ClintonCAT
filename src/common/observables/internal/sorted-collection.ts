class SortedCollection<T> {
    private _values: T[] = [];

    constructor(...values: T[]) {
        this.value = values;
    }

    /**
     * Searches for the specified value in the collection.
     */
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

    /**
     * Sets the values of the collection and sorts them.
     */
    set value(values: T[]) {
        this._values = values;
        this._values.sort();
    }

    /**
     * Adds the specified value to the collection.
     */
    add(value: T) {
        const idx = this._searchIndex(value);
        this._values.splice(idx, 0, value);
    }

    /**
     * Deletes the value at the specified index.
     */
    deleteAt(i: number) {
        this._values.splice(i, 1);
    }

    /**
     * Deletes the specified value from the collection.
     * Returns true if the value was found and deleted.
     */
    delete(value: T): boolean {
        const idx = this._searchIndex(value);
        if (this._values[idx] != value) return false;

        this.deleteAt(idx);
        return true;
    }
    /**
     * Clears all elements from the collection.
     */
    clear() {
        this._values = [];
    }
}

export default SortedCollection;
