#!/usr/bin/env -S deno --allow-all --ext ts
import { DenoFatInstaller } from "./deno-fatinstaller.ts";

await new DenoFatInstaller().install(...Deno.args)
