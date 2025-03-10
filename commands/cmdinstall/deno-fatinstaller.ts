import { USER_HOME } from "../lib/native-env.ts"
import { exists, copy } from "jsr:@std/fs";
import { basename, join } from "jsr:@std/path";
import $ from "jsr:@david/dax"

type InstallInfo = {
    commandPath: string,
    commandName: string,
    destinyPath: string,
}
type CopyInfo = InstallInfo & {
    copyTask: Promise<void>
}
type InstallationTask = () => PromiseLike<unknown>

export class DenoFatInstaller {
    #location: string | undefined;

    location(): string {
        if (!this.#location) {
            this.#location = this.#initLocation()
        }
        return this.#location
    }

    #initLocation(): string {
        const commandsPath = join(USER_HOME, ".deno", "sources")
        Deno.mkdirSync(commandsPath, { recursive: true })
        return commandsPath
    }

    async install(...commandPaths: string[]) {
        const commandPathsSet = new Set(commandPaths)

        const installInfos = [...this.#planifyInstallation(commandPathsSet)]
        const copyTasks = this.#sourcesCopy(installInfos)
        const preparedInstallTasks = this.#prepareInstallTasks(installInfos)

        for await (const _ of copyTasks);
        for await (const installTask of preparedInstallTasks) {
            await installTask()
        }
    }

    *#planifyInstallation(commandPaths: Iterable<string>): IterableIterator<InstallInfo> {
        for (const commandPath of commandPaths) {
            const commandName = basename(commandPath)
            const destinyPath = join(this.location(), commandName)

            yield { commandPath, commandName, destinyPath }
        }
    }

    async *#sourcesCopy(installInfos: Iterable<InstallInfo>): AsyncIterableIterator<void> {
        for (const { commandPath, destinyPath } of installInfos) {
            yield copy(commandPath, destinyPath, { overwrite: true })
        }
    }

    async *#prepareInstallTasks(installInfos: Iterable<InstallInfo>): AsyncIterableIterator<InstallationTask> {
        for (const installInfo of installInfos) {
            yield this.#prepareInstall(installInfo)
        }
    }

    async #prepareInstall({ commandPath, commandName, destinyPath }: InstallInfo): Promise<InstallationTask> {
        const hasMainFile = exists(join(commandPath, "__main__.ts"), { isFile: true })
        const isSingleFile = exists(commandPath, { isFile: true })

        if (await isSingleFile) {
            return () => $`deno install --name=${commandName} --allow-all --global -f ${destinyPath}`
        }
        if (await hasMainFile) {
            return () => $`deno install --name=${commandName} --allow-all --global -f ${join(destinyPath, "__main__.ts")}`
        }
        return () => Promise.resolve(
            console.warn(`⚠️  No __main__.ts found in ${destinyPath}. It will be traited only as a library`)
        )
    }
}