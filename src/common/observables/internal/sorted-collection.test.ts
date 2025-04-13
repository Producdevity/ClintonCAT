import SortedCollection from './sorted-collection';

describe('SortedCollection', () => {
    test('constructs with initial values in sorted order', () => {
        const col = new SortedCollection('b', 'a', 'c');
        expect(col.value).toEqual(['a', 'b', 'c']);
        expect(col.length).toBe(3);
    });

    test('adds a value maintaining sorted order', () => {
        const col = new SortedCollection('a', 'c');
        col.add('b');
        expect(col.value).toEqual(['a', 'b', 'c']);
        expect(col.length).toBe(3);
    });

    test('adds duplicate values in correct insertion order (no duplicate prevention)', () => {
        const col = new SortedCollection('a', 'b');
        col.add('a');
        expect(col.value).toEqual(['a', 'a', 'b']);
        expect(col.length).toBe(3);
    });

    test('deletes by index', () => {
        const col = new SortedCollection('a', 'b', 'c');
        col.deleteAt(1);
        expect(col.value).toEqual(['a', 'c']);
        expect(col.length).toBe(2);
    });

    test('deletes by value', () => {
        const col = new SortedCollection('a', 'b', 'c');
        const deleted = col.delete('b');
        expect(deleted).toBe(true);
        expect(col.value).toEqual(['a', 'c']);
        expect(col.length).toBe(2);

        // Attempt to delete a non-existent value:
        const notDeleted = col.delete('z');
        expect(notDeleted).toBe(false);
        expect(col.value).toEqual(['a', 'c']);
    });

    test('set value re-sorts the array', () => {
        const col = new SortedCollection();
        col.value = ['z', 'm', 'a'];
        expect(col.value).toEqual(['a', 'm', 'z']);
        expect(col.length).toBe(3);
    });

    test('clears the collection', () => {
        const col = new SortedCollection('a', 'b', 'c');
        col.clear();
        expect(col.value).toEqual([]);
        expect(col.length).toBe(0);
    });
});
