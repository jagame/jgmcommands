import { ConfigRepository } from "./config-repository.ts";
import { ConfigLocator } from "../domain/config-locator.ts";

export interface ConfigRepositoryFactory<T extends ConfigLocator> {

    configRepoOf({locator, group}: {locator: T, group: string}): ConfigRepository

}