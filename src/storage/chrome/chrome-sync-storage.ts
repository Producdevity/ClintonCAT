import { IStorageBackend } from '@/storage/istorage-backend';
import getChromeLastError from '@/utils/helpers/get-chrome-last-error';

class ChromeSyncStorage implements IStorageBackend {
    /**
     * Stores a value under the given key in chrome.storage.sync.
     * The value is JSON-stringified first.
     */
    async set(key: string, value: unknown): Promise<void> {
        const toStore = JSON.stringify(value);
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({ [key]: toStore }, () => {
                if (chrome.runtime.lastError) return reject(getChromeLastError());

                console.log(`ChromeSyncStorage.set: ${key} = ${toStore}`);
                resolve();
            });
        });
    }

    /**
     * Retrieves a value from chrome.storage.sync for the given key.
     * The stored value is JSON-parsed before returning.
     */
    async get(key: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(key, (result) => {
                if (chrome.runtime.lastError) return reject(getChromeLastError());

                const rawValue: unknown = result[key];
                console.log('Rawvalue', rawValue, typeof rawValue);

                if (rawValue === undefined || rawValue === null) {
                    console.log(`ChromeSyncStorage.get: ${key} => null`);
                    return resolve(null);
                }

                if (typeof rawValue !== 'string') {
                    console.warn(`ChromeSyncStorage.get: stored value for '${key}' is not a string. Returning null.`);
                    return resolve(null);
                }

                try {
                    const parsedValue = JSON.parse(rawValue) as unknown;
                    console.log(`ChromeSyncStorage.get: ${key} =>`, parsedValue);

                    return parsedValue !== null ? resolve(parsedValue) : resolve(null);
                } catch (_error) {
                    console.warn(
                        `ChromeSyncStorage.get: could not parse value for key '${key}'. Returning raw value as string.`
                    );
                    return resolve(rawValue);
                }
            });
        });
    }

    /**
     * Removes the given key from chrome.storage.sync.
     */
    async remove(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.remove(key, () => {
                if (chrome.runtime.lastError) return reject(getChromeLastError());
                console.log(`ChromeSyncStorage.remove: ${key}`);
                resolve();
            });
        });
    }
}

export default ChromeSyncStorage;
