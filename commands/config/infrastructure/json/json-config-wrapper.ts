import { plainSplit } from "../../../lib/text-splitter.ts";
import { ConfigWrapper } from "../../domain/config-wrapper.ts";


export class JsonConfiguration<T = unknown> implements ConfigWrapper<T> {
    #config: T;

    constructor(configObj: T) {
        this.#config = configObj
    }

    get<R = unknown>(property: string): R {
        const awaitedConfig = this.#config
        const splittedProperty = plainSplit(property, ".")

        return this.#getRecursivaly(awaitedConfig, splittedProperty)
    }

    // deno-lint-ignore no-explicit-any
    #getRecursivaly<V = unknown>(obj: any, splittedProperty: Iterable<string>): V {
        const { value: attr, done } = splittedProperty[Symbol.iterator]().next()
        if (done) {
            return obj
        }
        return this.#getRecursivaly(obj[attr], splittedProperty)
    }

    remove(property: string): void {
        this.set(property, null)
    }

    set(property: string, value: unknown): void {
        this.#setRecursivaly(this.#config, property.split("."), value)
    }

    // deno-lint-ignore no-explicit-any
    #setRecursivaly(obj: any, splittedProperty: string[], value: unknown): void {
        const [attr, ...rest] = splittedProperty
        if (rest.length == 0) {
            obj[attr] = value
            return
        }

        if (!(obj instanceof Object)) {
            obj[attr] = {}
        }
        this.#setRecursivaly(obj[attr], rest, value)
    }

    *keys(): IterableIterator<string> {
        for (const [key] of this.entries()) {
            yield key
        }
    }

    *entries(): IterableIterator<[string, unknown]> {
        yield* this.#plainEntriesOf(this.#config)
    }

    *#plainEntriesOf<P = unknown>(obj: P): IterableIterator<[string, unknown]> {
        for (const key in obj) {
            if (!(obj[key] instanceof Object)) {
                yield [key, obj[key]]
                continue
            }
            for (const [attrKey, attrValue] of this.#plainEntriesOf(obj[key])) {
                yield [`${key}.${attrKey}`, attrValue]
            }
        }
    }

    unwrap(): T {
        return this.#config
    }

}
