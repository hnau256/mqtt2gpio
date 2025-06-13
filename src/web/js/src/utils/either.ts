export abstract class Either<L, R> {

    fold<O>(
            ifLeft: (value: L) => O,
            ifRight: (value: R) => O,
    ): O {
        if (this instanceof Left) {
            return ifLeft(this.value)
        }
        if (this instanceof Right) {
            return ifRight(this.value)
        }
        throw new Error("Unexpected type");
    }

}

export class Left<L> extends Either<L, never> {

    private _value: L

    constructor(
            value: L
    ) {
        super()
        this._value = value
    }

    public get value(): L {
        return this._value;
    }
}

export class Right<R> extends Either<never, R> {

    private _value: R

    constructor(
            value: R
    ) {
        super()
        this._value = value
    }

    public get value(): R {
        return this._value;
    }
}