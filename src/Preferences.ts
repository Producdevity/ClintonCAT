import { IStorageBackend } from './storage/IStorageBackend';
import { Nullable } from './utils/utils.types';
import ValueListener from './listeners/ValueListener';
import OrderedSetListener from './listeners/OrderedSetListener';

class Preferences {
    static readonly IS_ENABLED_KEY = 'is_enabled';
    static readonly DOMAIN_EXCLUSIONS_KEY = 'domain_exclusions';

    static isEnabled = new ValueListener<boolean>(true);
    static domainExclusions = new OrderedSetListener<string>();

    // Injected storage backends  (TODO: do we need both?)
    // Sync is used to share data across browsers if logged in, e.g. plugin settings
    // Local is for 'this' browser only storage and can have more space available, e.g. for the pages db
    private static preferenceStore: Nullable<IStorageBackend> = null;
    private static localStore: Nullable<IStorageBackend> = null;

    /**
     * Inject whichever storage backends you want to use (sync, local, or even mocks for testing).
     */
    static setBackingStores(preferenceStore: IStorageBackend, localStore: IStorageBackend) {
        this.preferenceStore = preferenceStore;
        this.localStore = localStore;
    }

    /**
     * Fetches settings from storage and updates local ValueListeners.
     */
    static async refresh(): Promise<void> {
        console.log('Refreshing settings');

        const isEnabledVal = await this.getPreference(this.IS_ENABLED_KEY);
        this.isEnabled.value = typeof isEnabledVal === 'boolean' ? isEnabledVal : true;

        // Retrieve domainExclusions
        const domainExclusionsVal = await this.getPreference(this.DOMAIN_EXCLUSIONS_KEY);

        if (Array.isArray(domainExclusionsVal)) {
            // Filter the array to ensure string[]
            this.domainExclusions.value = domainExclusionsVal.filter(
                (item): item is string => typeof item === 'string'
            );
            return;
        }

        // Fallback to empty array
        this.domainExclusions.value = [];
    }

    /**
     * Initialize the ValueListeners with default values and listeners.
     */
    static init() {
        // Reset and set up isEnabled
        this.isEnabled.removeAllListeners();
        this.isEnabled.value = true;
        this.isEnabled.addListener(this.IS_ENABLED_KEY, (result: boolean) => {
            void this.setPreference(Preferences.IS_ENABLED_KEY, result);
        });

        // Reset and set up domainExclusions
        this.domainExclusions.removeAllListeners();
        this.domainExclusions.value = [];
        this.domainExclusions.addListener(this.DOMAIN_EXCLUSIONS_KEY, (result: string[]) => {
            void this.setPreference(Preferences.DOMAIN_EXCLUSIONS_KEY, result);
        });
    }

    /**
     * Get defaults from localStorage, if available
     * and override the in-memory defaults.
     */
    static async initDefaults() {
        console.log('Defaulting settings');

        // If no localStore is available, use in-memory defaults
        if (!this.localStore) {
            console.warn('No localStore defined; using in-memory defaults for isEnabled and domainExclusions.');
            return this.init();
        }

        const rawIsEnabled = await this.localStore.get(this.IS_ENABLED_KEY);
        if (typeof rawIsEnabled === 'boolean') {
            this.isEnabled.value = rawIsEnabled;
        }

        const rawDomainExclusions = await this.localStore.get(this.DOMAIN_EXCLUSIONS_KEY);
        if (Array.isArray(rawDomainExclusions)) {
            this.domainExclusions.value = rawDomainExclusions.filter(
                (item): item is string => typeof item === 'string'
            );
        }

        this.init();
    }

    public static dump(): void {
        const msg: string =
            `IsEnabled = ${Preferences.isEnabled.toString()}, ` +
            `DomainExclusions = ${Preferences.domainExclusions.toString()}`;
        console.log(msg);
    }

    /**
     * Actual reading/writing now delegated to the injected preference store
     */
    static async setPreference(key: string, value: unknown): Promise<void> {
        if (!this.preferenceStore) {
            throw new Error('No preferenceStore defined! Call setBackingStores() first.');
        }
        await this.preferenceStore.set(key, value);
        console.log(`(setPreference) ${key} = ${JSON.stringify(value)}`);
    }

    static async getPreference(key: string): Promise<unknown> {
        if (!this.preferenceStore) {
            throw new Error('No preferenceStore defined! Call setBackingStores() first.');
        }
        const value = await this.preferenceStore.get(key);
        console.log(`(getPreference) ${key} =>`, value);
        return value;
    }

    // TODO: decide whether to use localStore or preferenceStore
    static async setStorage(key: string, value: unknown): Promise<void> {
        if (!this.localStore) {
            throw new Error('No localStore defined! Call setBackingStores() first.');
        }
        await this.localStore.set(key, value);
        console.log(`(setStorage) ${key} = ${JSON.stringify(value)}`);
    }

    static async getStorage(key: string): Promise<unknown> {
        if (!this.localStore) {
            throw new Error('No localStore defined! Call setBackingStores() first.');
        }
        const value = await this.localStore.get(key);
        console.log(`(getStorage) ${key} =>`, value);
        return value;
    }
}

export default Preferences;
