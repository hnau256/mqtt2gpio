import { LifeScope } from "../../lifeScope";
import { Observable } from "../observable";
import { StateObservable } from "./stateObservable";

export class SimpleStateObservableImpl<T> implements StateObservable<T> {

    private _value: T

    private source: Observable<T>

    constructor(
            initialValue: T,
            source: Observable<T>,
    ) {
        this._value = initialValue
        this.source = source
    }

    get value(): T {
        return this._value
    }

    observe(
            lifeScope: LifeScope,
            callback: (value: T) => void,
    ): void {
        callback(this._value)
        this.source.observe(
             lifeScope,
            (value: T) => {
                this._value = value
                callback(value)
            }
        )
    }
}