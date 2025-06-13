export abstract class Optional<T> {

    fold<R>(
            ifNone: () => R,
            ifSome: (value: T) => R,
    ): R {
        if (this instanceof None) {
            return ifNone()
        }
        if (this instanceof Some) {
            return ifSome(this.value)
        }
        throw new Error("Unexpected type");
    }

    map<O>(
            transform: (value: T) => O,
    ): Optional<O> {
        return this.fold<Optional<O>>(
            () => None.instance,
            (value: T) => new Some(transform(value)),
        )
    }
}

export class None extends Optional<never> {
    static instance = new None
}

export class Some<T> extends Optional<T> {

    private _value: T

    constructor(
            value: T
    ) {
        super();

        this._value = value
    }

    public get value(): T {
        return this._value
    }
}