import ObservableValue from './observable-value';

describe('ObservableValue', () => {
    test('initial value is set properly', () => {
        const obs = new ObservableValue('initial');
        expect(obs.value).toBe('initial');
    });

    test('setting a new value triggers callbacks', () => {
        const obs = new ObservableValue('oldValue');
        const mockCallback = jest.fn();

        obs.addListener('testCallback', mockCallback);
        obs.value = 'newValue';

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith('newValue');
    });

    test('removing a callback stops it from being called', () => {
        const obs = new ObservableValue('value');
        const mockCallback = jest.fn();

        obs.addListener('testCallback', mockCallback);
        obs.removeListener('testCallback');
        obs.value = 'anotherValue';

        expect(mockCallback).not.toHaveBeenCalled();
    });

    test('removing all callbacks stops all from being called', () => {
        const obs = new ObservableValue('value');
        const mockCallback1 = jest.fn();
        const mockCallback2 = jest.fn();

        obs.addListener('cb1', mockCallback1);
        obs.addListener('cb2', mockCallback2);

        obs.removeAllListeners();
        obs.value = 'newVal';

        expect(mockCallback1).not.toHaveBeenCalled();
        expect(mockCallback2).not.toHaveBeenCalled();
    });

    test('re-adding the same listener ID overrides previous callback', () => {
        const obs = new ObservableValue('initial');
        const firstCallback = jest.fn();
        const secondCallback = jest.fn();

        obs.addListener('listener', firstCallback);
        obs.addListener('listener', secondCallback);

        obs.value = 'trigger';
        expect(firstCallback).not.toHaveBeenCalled();
        expect(secondCallback).toHaveBeenCalledTimes(1);
    });

    test('toString returns the value.toString()', () => {
        const obs = new ObservableValue('stringValue');
        expect(obs.toString()).toBe('stringValue');
    });
});
