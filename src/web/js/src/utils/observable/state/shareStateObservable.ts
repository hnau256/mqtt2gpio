import { LifeScope } from "../../lifeScope";
import { Observable } from "../observable";
import { MutableStateObservableImpl } from "./mutable/mutableStateObservableImpl";
import { StateObservable } from "./stateObservable";

export class StateObservableImpl<T> implements StateObservable<T> {

    private source: StateObservable<T>

    constructor(
        args: {
            lifeScope: LifeScope,
            source: Observable<T>,
            initialValue: T
        }
    ) {
        let source = new MutableStateObservableImpl({
            initialValue: args.initialValue,
        })
        args.source.observe({
            lifeScope: args.lifeScope,
            callback: (value) => source.value = value
        })
        this.source = source
    }

    get value(): T {
        return this.source.value
    }
    observe(
        args: {
            lifeScope: LifeScope;
            callback: (value: T) => void;
        }
    ): void {
        this.source.observe(args)
    }
}