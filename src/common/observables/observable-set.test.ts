import ObservableSet from './observable-set';

describe('ObservableSet', () => {
    test('constructs with initial values (sorted internally)', () => {
        const obsSet = new ObservableSet('b', 'a', 'd', 'c');
        expect(obsSet.value).toEqual(['a', 'b', 'c', 'd']);
    });

    test('adding a new element triggers callbacks', () => {
        const obsSet = new ObservableSet('a');
        const mockCallback = jest.fn();

        obsSet.addListener('onAdd', mockCallback);
        obsSet.add('b');

        expect(obsSet.value).toEqual(['a', 'b']);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(['a', 'b']);
    });

    test('adding an existing element does not trigger callbacks', () => {
        const obsSet = new ObservableSet('a', 'b');
        const mockCallback = jest.fn();

        obsSet.addListener('onAdd', mockCallback);
        obsSet.add('b'); // 'b' is already in the set

        expect(obsSet.value).toEqual(['a', 'b']);
        expect(mockCallback).not.toHaveBeenCalled();
    });

    test('deleteAt removes the correct element and triggers callbacks', () => {
        const obsSet = new ObservableSet('a', 'b', 'c');
        const mockCallback = jest.fn();

        obsSet.addListener('onDeleteAt', mockCallback);
        obsSet.deleteAt(1); // Remove 'b'

        expect(obsSet.value).toEqual(['a', 'c']);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(['a', 'c']);
    });

    test('delete removes the correct element if present', () => {
        const obsSet = new ObservableSet('x', 'y', 'z');
        const mockCallback = jest.fn();

        obsSet.addListener('onDelete', mockCallback);
        obsSet.delete('y');

        expect(obsSet.value).toEqual(['x', 'z']);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(['x', 'z']);

        // Attempt to delete a non-existent element
        obsSet.delete('not-there');
        expect(obsSet.value).toEqual(['x', 'z']);
        // Callback should not fire again.
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('setting .value replaces entire set and triggers callbacks', () => {
        const obsSet = new ObservableSet('initial1', 'initial2');
        const mockCallback = jest.fn();
        obsSet.addListener('onSetValue', mockCallback);

        obsSet.value = ['z', 'm', 'a'];

        expect(obsSet.value).toEqual(['a', 'm', 'z']);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(['a', 'm', 'z']);
    });

    test('removing a single listener works', () => {
        const obsSet = new ObservableSet('a');
        const mockCallback = jest.fn();

        obsSet.addListener('listener1', mockCallback);
        obsSet.removeListener('listener1');

        obsSet.add('b');
        expect(mockCallback).not.toHaveBeenCalled();
    });

    test('removeAllListeners clears all callbacks', () => {
        const obsSet = new ObservableSet('a');
        const mockCallback1 = jest.fn();
        const mockCallback2 = jest.fn();

        obsSet.addListener('cb1', mockCallback1);
        obsSet.addListener('cb2', mockCallback2);

        obsSet.removeAllListeners();
        obsSet.add('b');

        expect(mockCallback1).not.toHaveBeenCalled();
        expect(mockCallback2).not.toHaveBeenCalled();
    });

    test('toString returns a comma-separated string of the sorted collection', () => {
        const obsSet = new ObservableSet('c', 'b', 'a');
        expect(obsSet.toString()).toBe('a,b,c');
    });
});
