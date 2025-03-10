export interface ConfigWrapper<T = unknown> {
    
    get<T = unknown>(property: string): T

    remove(property: string): void
    
    set(property: string, value: unknown): void

    keys(): IterableIterator<PropertyKey>

    entries(): IterableIterator<[PropertyKey, unknown]>

    unwrap(): T

}