import { LifeScope } from "../../lifeScope";
import { StateObservable } from "./stateObservable";

export class SingleStateObservable<T> implements StateObservable<T> {

    private _value: T

    constructor(
            value: T
    ) {
        this._value = value
    }

    get value(): T {
        return this._value
    }

    observe(
             lifeScope: LifeScope,
            callback: (value: T) => void,
    ): void {
        callback(this._value)
    }
}