#!/usr/bin/env -S deno --allow-all --ext ts
import { PlainConfigurer } from "./plain-configurer.ts";
import { ConfigLocation, ConfigLocations } from "./config-location.ts";

type Operation = keyof Pick<PlainConfigurer, "get" | "set">

function getOperation(arg: string): Operation {
    if (arg != "get" && arg != "set") {
        throw `Illegal argument ${arg}`
    }
    return arg
}

function getLocation(arg: string): ConfigLocation {
    const locationName = arg?.toUpperCase()
    if (locationName != "LOCAL" && locationName != "GLOBAL") {
        throw `Illegal argument ${arg}`
    }
    return ConfigLocations[locationName]
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
    const location: ConfigLocation = getLocation(reqArgument(2))
    const property: string = reqArgument(3)
    const value: string | undefined = getValue(Deno.args[4], operation)

    const configurer = new PlainConfigurer(group, location)
    configurer[operation](property, value)
    configurer.save()
} catch (error) {
    printHelp()
    console.log()
    throw error
}