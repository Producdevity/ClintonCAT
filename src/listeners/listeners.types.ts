export interface Printable {
    toString(): string;
}

export type ResultCallback<T> = (result: T) => void;

export interface IListener<T> {
    value: T;
    callbacks: Map<string, ResultCallback<T>>;
    addListener(id: string, callback: ResultCallback<T>): void;
    removeListener(id: string): void;
    removeAllListeners(): void;
}
