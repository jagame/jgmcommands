import { ConfigLocation } from "./config-location.ts";
import { ConfigLoader } from "./config-loader.ts";
import { plainSplit } from "./text-splitter.ts";


export class PlainConfigurer<T extends object = object> {
    #configLoader: ConfigLoader<T>;
    #config: Promise<T>;

    constructor(group: string, location: ConfigLocation) {
        const configFilePath = location(group)
        this.#configLoader = new ConfigLoader<T>(configFilePath)
        this.#config = this.#configLoader.load()
    }

    async get(property: string): Promise<unknown> {
        const awaitedConfig = await this.#config
        const splittedProperty = plainSplit(property, ".")

        return this.#getRecursivaly(awaitedConfig, splittedProperty)
    }

    // deno-lint-ignore no-explicit-any
    #getRecursivaly<T = unknown>(obj: any, splittedProperty: Iterable<string>): T {
        const { value: attr, done } = splittedProperty[Symbol.iterator]().next()
        if (done) {
            return obj
        }
        return this.#getRecursivaly(obj[attr], splittedProperty)
    }

    async remove(property: string) {
        await this.set(property, null)
    }

    async set(property: string, value: unknown) {
        this.#setRecursivaly(await this.#config, property.split("."), value)
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

    async *keys(): AsyncIterableIterator<string> {
        for await (const [key] of this.entries()) {
            yield key
        }
    }

    async *entries(): AsyncIterableIterator<[string, unknown]> {
        yield* this.#plainEntriesOf(await this.#config)
    }

    *#plainEntriesOf<T>(obj: T): IterableIterator<[string, unknown]> {
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

    async save() {
        this.#configLoader.save(await this.#config)
    }

}
