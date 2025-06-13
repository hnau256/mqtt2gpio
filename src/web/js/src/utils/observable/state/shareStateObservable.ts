import { LifeScope } from "../../lifeScope";
import { Observable } from "../observable";
import { MutableStateObservableImpl } from "./mutable/mutableStateObservableImpl";
import { StateObservable } from "./stateObservable";

export class StateObservableImpl<T> implements StateObservable<T> {

    private source: StateObservable<T>

    constructor(
            lifeScope: LifeScope,
            simpleSource: Observable<T>,
            initialValue: T,
    ) {
        let source = new MutableStateObservableImpl( initialValue)
        simpleSource.observe(
            lifeScope,
            (value) => source.value = value
        )
        this.source = source
    }

    get value(): T {
        return this.source.value
    }

    observe(
            lifeScope: LifeScope,
            callback: (value: T) => void,
    ): void {
        this.source.observe(lifeScope, callback)
    }
}