import { exists } from "jsr:@std/fs"

export class ConfigLoader<T = unknown> {
    readonly #filePath: string;

    constructor(filePath: string) {
        this.#filePath = filePath
    }

    async load(): Promise<T> {
        if (await exists(this.#filePath)) {
            return JSON.parse(await Deno.readTextFile(this.#filePath))
        } else {
            return {} as T
        }
    }

    async save(configObj: T) {
        await Deno.writeTextFile(this.#filePath, JSON.stringify(configObj), { create: true })
    }

}