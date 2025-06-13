import { LifeScope } from "../../lifeScope";
import { StateObservable } from "./stateObservable";

export class SingleStateObservable<T> implements StateObservable<T> {

    private _value: T

    constructor(
        args: {
            value: T
        }
    ) {
        this._value = args.value
    }

    get value(): T {
        return this._value
    }
    observe(
        args: {
            lifeScope: LifeScope;
            callback: (value: T) => void;
        }
    ): void {
        args.callback(this._value)
    }
}