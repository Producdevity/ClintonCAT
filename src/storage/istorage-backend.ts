export interface IStorageBackend {
    set(key: string, value: unknown): Promise<void>;
    get(key: string): Promise<unknown>;
    remove?(key: string): Promise<void>;
}
