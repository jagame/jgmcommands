import { join } from "jsr:@std/path";
import { USER_HOME } from "../../../lib/native-env.ts";
import { existsSync } from "jsr:@std/fs/exists";
import { ConfigLocator } from "../../domain/config-locator.ts";

function localLocator(group: string) {
    return join(Deno.cwd(), ".env", `${group}-config.json`)
}

function globalLocator(group: string){
    return join(USER_HOME, ".env", `${group}-config.json`)
}

function existentLocator(group: string) {
    for(const configLocation of [localLocator, globalLocator]) {
        const path = configLocation(group)
        if(existsSync(path, {isFile: true})) {
            return path
        }
    }
    throw `No .env/${group}-config.json file found either the local and the global path`
}

export type JsonConfigLocator = ConfigLocator & {extension: "json"}

export class JsonConfigLocations {

    static LOCAL: JsonConfigLocator = {
        extension: "json",
        locate: localLocator
    }
    static GLOBAL: JsonConfigLocator = {
        extension: "json",
        locate: globalLocator
    }
    static ANY: JsonConfigLocator = {
        extension: "json",
        locate: existentLocator
    }
}