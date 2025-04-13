import getChromeLastError from './get-chrome-last-error';

describe(getChromeLastError.name, () => {
    beforeEach(() => {
        global.chrome = {
            runtime: {
                lastError: undefined,
            },
        } as typeof chrome;
    });

    it('should return the lastError if it is an instance of Error', () => {
        const error = new Error('Test error');
        global.chrome.runtime.lastError = error;
        expect(getChromeLastError()).toBe(error);
    });

    it("should return a new Error with 'Unknown error' if lastError is not an instance of Error", () => {
        global.chrome.runtime.lastError = 'Some error string' as chrome.runtime.LastError;
        expect(getChromeLastError()).toEqual(new Error('Unknown error'));
    });

    it("should return a new Error with 'Unknown error' if lastError is null", () => {
        global.chrome.runtime.lastError = undefined;
        expect(getChromeLastError()).toEqual(new Error('Unknown error'));
    });
});
