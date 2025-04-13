export type ResultCallback<T> = (result: T) => void;

export interface IObservable<T> {
    get value(): T;
    set value(val: T);
    addListener(id: string, callback: ResultCallback<T>): void;
    removeListener(id: string): void;
    removeAllListeners(): void;
}
