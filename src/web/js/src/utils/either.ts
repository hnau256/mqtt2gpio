export abstract class Either<L, R> {

    fold<O>(
        args: {
            ifLeft: (value: L) => O,
            ifRight: (value: R) => O,
        }
    ): O {
        if (this instanceof Left) {
            return args.ifLeft(this.value)
        }
        if (this instanceof Right) {
            return args.ifRight(this.value)
        }
        throw new Error("Unexpected type");
    }

}

export class Left<L> extends Either<L, never> {

    private _value: L

    constructor(
        args: {
            value: L
        }
    ) {
        super()
        this._value = args.value
    }

    public get value(): L {
        return this._value;
    }
}

export class Right<R> extends Either<never, R> {

    private _value: R

    constructor(
        args: {
            value: R
        }
    ) {
        super()
        this._value = args.value
    }

    public get value(): R {
        return this._value;
    }
}