export interface ConfigLocator {
    extension: string
    locate(group: string): string
}