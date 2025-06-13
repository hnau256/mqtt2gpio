export abstract class Optional<T> {

    fold<R>(
        args: {
            ifNone: () => R,
            ifSome: (value: T) => R,
        }
    ): R {
        if (this instanceof None) {
            return args.ifNone()
        }
        if (this instanceof Some) {
            return args.ifSome(this.value)
        }
        throw new Error("Unexpected type");
    }

    map<O>(
        args: {
            transform: (value: T) => O,
        }
    ): Optional<O> {
        return this.fold({
            ifNone: () => None.instance,
            ifSome: (value: T) => new Some({ value: args.transform(value) })
        })
    }
}

export class None extends Optional<never> {
    static instance = new None
}

export class Some<T> extends Optional<T> {

    private _value: T

    constructor(
        args: {
            value: T
        }
    ) {
        super();

        this._value = args.value
    }

    public get value(): T {
        return this._value
    }
}