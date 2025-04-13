import { IStorageBackend } from '@/storage/istorage-backend';
import getChromeLastError from '@/utils/helpers/get-chrome-last-error';

class ChromeLocalStorage implements IStorageBackend {
    /**
     * Stores a value under the given key in chrome.storage.local.
     * The value is JSON-stringified first.
     */
    async set(key: string, value: unknown): Promise<void> {
        const toStore = JSON.stringify(value);
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ [key]: toStore }, () => {
                if (chrome.runtime.lastError) return reject(getChromeLastError());

                console.log(`ChromeLocalStorage.set: ${key} = ${toStore}`);
                resolve();
            });
        });
    }

    /**
     * Retrieves a value from chrome.storage.local for the given key.
     * The stored value is JSON-parsed before returning.
     */
    async get(key: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (result) => {
                if (chrome.runtime.lastError) return reject(getChromeLastError());

                const rawValue: unknown = result[key];

                if (rawValue === undefined || rawValue === null) {
                    console.log(`ChromeLocalStorage.get: ${key} => null`);
                    return resolve(null);
                }

                if (typeof rawValue !== 'string') {
                    console.warn(`ChromeLocalStorage.get: stored value for '${key}' is not a string. Returning null.`);
                    return resolve(null);
                }

                try {
                    const parsedValue = JSON.parse(rawValue) as unknown;
                    console.log(`ChromeLocalStorage.get: ${key} =>`, parsedValue);

                    return parsedValue !== null ? resolve(parsedValue) : resolve(null);
                } catch (_error) {
                    console.warn(
                        `ChromeLocalStorage.get: could not parse value for key '${key}'. Returning raw value as string.`
                    );
                    return resolve(rawValue);
                }
            });
        });
    }

    /**
     * Removes the given key from chrome.storage.local.
     */
    async remove(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove(key, () => {
                if (chrome.runtime.lastError) return reject(getChromeLastError());
                console.log(`ChromeLocalStorage.remove: ${key}`);
                resolve();
            });
        });
    }
}

export default ChromeLocalStorage;
