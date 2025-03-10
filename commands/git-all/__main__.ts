import { existsSync } from "jsr:@std/fs"
import $ from "jsr:@david/dax"
import { join } from "jsr:@std/path";

if (Deno.args.length == 0) {
    console.log("git-all requires at least one git argument.\n")
    const gitHelp = await $`git -h`.text()
    console.log("git", gitHelp)
    Deno.exit(0)
}

for (const dirEntry of Deno.readDirSync(".")) {
    if (existsSync(join(dirEntry.name, ".git"), { isDirectory: true })) {
        Deno.chdir(dirEntry.name)
        await $`git ${Deno.args}`
        Deno.chdir("..")
    }
}