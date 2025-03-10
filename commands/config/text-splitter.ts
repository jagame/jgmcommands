export function* plainSplit(text: string, separator: string): IterableIterator<string> {
    const jump = separator.length
    let nextStart = 0
    while (nextStart <= text.length) {
        const matchIndex = text.indexOf(separator, nextStart)
        if (matchIndex == -1) {
            return yield text.substring(nextStart)
        }
        yield text.substring(nextStart, matchIndex)
        nextStart = matchIndex + jump
    }
}