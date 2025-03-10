import { ConfigWrapper } from "../domain/config-wrapper.ts";

export interface ConfigRepository<T extends ConfigWrapper = ConfigWrapper> {
    load(): Promise<T>
    
    save(): Promise<void>
}
