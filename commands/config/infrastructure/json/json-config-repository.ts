import { ConfigRepository } from "../../application/config-repository.ts";
import { JsonConfiguration } from "./json-config-wrapper.ts";

export class JsonConfigRepository<T = unknown> implements ConfigRepository<JsonConfiguration<T>> {
    readonly #filePath: string;
    #configObj?: T

    constructor(filePath: string) {
        this.#filePath = filePath
    }

    async load(): Promise<JsonConfiguration<T>> {
        if(!this.#configObj) {
            this.#configObj = await this.#readConfig()
        }
        return new JsonConfiguration<T>(this.#configObj)
    }

    async #readConfig(): Promise<T> {
        try {
            return JSON.parse(await Deno.readTextFile(this.#filePath))
        } catch (error) {
            if(!(error instanceof Deno.errors.NotFound)) {
                throw error
            }
            return {} as T
        }
    }

    async save() {
        await Deno.writeTextFile(this.#filePath, JSON.stringify(this.#configObj), { create: true })
    }

}