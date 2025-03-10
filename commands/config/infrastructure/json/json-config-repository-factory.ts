import { ConfigRepositoryFactory } from "../../application/config-repository-factory.ts";
import { ConfigRepository } from "../../application/config-repository.ts";
import { JsonConfigLocator } from "./json-config-locators.ts";
import { JsonConfigRepository } from "./json-config-repository.ts";

export class JsonConfigRepositoryFactory implements ConfigRepositoryFactory<JsonConfigLocator> {

    #reposCache: Map<string, WeakRef<JsonConfigRepository>>

    constructor() {
        this.#reposCache = new Map()
    }

    configRepoOf({ locator, group }: { locator: JsonConfigLocator; group: string; }): ConfigRepository {
        const path = locator.locate(group)
        let configRepo = this.#reposCache.get(path)?.deref()
        if(!configRepo) {
            configRepo = new JsonConfigRepository(path)
            this.#reposCache.set(path, new WeakRef(configRepo))
        }
        return configRepo
    }

}