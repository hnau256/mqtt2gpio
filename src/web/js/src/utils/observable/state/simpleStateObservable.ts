import { LifeScope } from "../../lifeScope";
import { Observable } from "../observable";
import { StateObservable } from "./stateObservable";

export class SimpleStateObservableImpl<T> implements StateObservable<T> {

    private _value: T

    private source: Observable<T>

    constructor(
        args: {
            initialValue: T,
            source: Observable<T>,
        }
    ) {
        this._value = args.initialValue
        this.source = args.source
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
        this.source.observe({
            lifeScope: args.lifeScope,
            callback: (value: T) => {
                this._value = value
                args.callback(value)
            }
        })
    }
}