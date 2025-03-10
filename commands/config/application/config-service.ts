import { ConfigRepositoryFactory } from "./config-repository-factory.ts";
import { ConfigLocator } from "../domain/config-locator.ts";

type ReadAllOrder<T extends ConfigLocator> = {
    locator: T,
    group: string
}

type ReadOrder<T extends ConfigLocator> = ReadAllOrder<T> & { property: string }

type RemoveOrder<T extends ConfigLocator> = ReadOrder<T>

type WriteOrder<T extends ConfigLocator> = ReadOrder<T> & { value: unknown }

export class ConfigService<T extends ConfigLocator> {

    readonly #configRepoFactory: ConfigRepositoryFactory<T>

    constructor(configRepoFactory: ConfigRepositoryFactory<T>) {
        this.#configRepoFactory = configRepoFactory
    }

    async *getAll<V>({locator, group}: ReadAllOrder<T> ): AsyncIterableIterator<[PropertyKey, V]> {
        const configRepo = this.#configRepoFactory.configRepoOf({ locator, group })
        const configuration = await configRepo.load()
        for await (const [key, value] of configuration.entries()) {
            yield [key, value as V]
        }
    }

    async get<R>({ locator, group, property }: ReadOrder<T>): Promise<R> {
        const configRepo = this.#configRepoFactory.configRepoOf({ locator, group })
        const configuration = await configRepo.load()
        return configuration.get(property)
    }

    async set({ locator, group, property, value }: WriteOrder<T>): Promise<void> {
        const configRepo = this.#configRepoFactory.configRepoOf({ locator, group })
        
        const configuration = await configRepo.load()
        configuration.set(property, value)
        await configRepo.save()
    }

    async remove({ locator, group, property }: RemoveOrder<T>) {
        const configRepo = this.#configRepoFactory.configRepoOf({ locator, group })
        
        const configuration = await configRepo.load()
        configuration.remove(property)
        await configRepo.save()
    }

}