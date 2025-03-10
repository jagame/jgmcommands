import { join } from "jsr:@std/path";
import { USER_HOME } from "../lib/native-env.ts";

export type ConfigLocation = (command: string) => string

export const ConfigLocations: { LOCAL: ConfigLocation, GLOBAL: ConfigLocation } = {
    LOCAL: (group: string) => join(Deno.cwd(), ".env", `${group}.config.json`),
    GLOBAL: (group: string) => join(USER_HOME, ".env", `${group}.config.json`)
}