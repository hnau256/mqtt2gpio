export abstract class Loadable<T> {

    fold<R>(
            ifLoading: () => R,
            ifReady: (value: T) => R,
    ): R {
        if (this instanceof Loading) {
            return ifLoading()
        }
        if (this instanceof Ready) {
            return ifReady(this.value)
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
        
            value: T
    ) {
        super();

        this._value = value
    }

    public get value(): T {
        return this._value
    }
}