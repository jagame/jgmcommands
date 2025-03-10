#!/usr/bin/env -S deno --allow-all --ext ts

import { ConfigService } from "./application/config-service.ts";
import { JsonConfigLocations, JsonConfigLocator } from "./infrastructure/json/json-config-locators.ts";
import { JsonConfigRepositoryFactory } from "./infrastructure/json/json-config-repository-factory.ts";

type Operation = keyof Pick<ConfigService<JsonConfigLocator>, "get" | "set">

function getOperation(arg: string): Operation {
    if (arg != "get" && arg != "set") {
        throw `Illegal argument ${arg}`
    }
    return arg
}

function getLocator(arg: string): JsonConfigLocator {
    const locationName = arg?.toUpperCase()
    if (locationName != "LOCAL" && locationName != "GLOBAL") {
        throw `Illegal argument ${arg}`
    }
    return JsonConfigLocations[locationName]
}

function getValue(arg: string, operation: Operation): string | undefined {
    if (operation == "set" && arg == null) {
        throw `<Set> operation require a value`
    }
    return arg === 'null' ? undefined : arg
}

function reqArgument(index: number): string {
    if (!Deno.args[index]) {
        throw `Require argument at index ${index}`
    }
    return Deno.args[index]
}

function printHelp(): void {
    console.log("Use: config <group> get|set global|local <property-key> [<value>]")
}


// Main:
if (["--help", "-h"].includes(Deno.args[0])) {
    printHelp()
    Deno.exit(0)
}


try {
    const group: string = reqArgument(0)
    const operation: Operation = getOperation(reqArgument(1))
    const locator: JsonConfigLocator = getLocator(reqArgument(2))
    const property: string = reqArgument(3)
    const value: string | undefined = getValue(Deno.args[4], operation)

    const service = new ConfigService(new JsonConfigRepositoryFactory())
    service[operation]({locator, group, property, value})
} catch (error) {
    printHelp()
    console.log()
    throw error
}