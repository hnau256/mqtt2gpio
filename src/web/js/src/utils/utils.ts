export function  then<I, O>(
    source: I,
    transform: (source: I) => O,
): O {
    return transform(source)
}

export function  also<T>(
    source: T,
    block: (source: T) => void,
): T {
    block(source)
    return source
}