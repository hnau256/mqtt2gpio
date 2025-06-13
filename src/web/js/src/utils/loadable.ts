export abstract class Loadable<T> {



    fold<R>(
        args: {
            ifLoading: () => R,
            ifReady: (value: T) => R,
        }
    ): R {
        if (this instanceof Loading) {
            return args.ifLoading()
        }
        if (this instanceof Ready) {
            return args.ifReady(this.value)
        }
        throw new Error("Unexpected type");
    }
}

export class Loading extends Loadable<never> {
    static instance = new Loading
}

export class Ready<T> extends Loadable<T> {

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