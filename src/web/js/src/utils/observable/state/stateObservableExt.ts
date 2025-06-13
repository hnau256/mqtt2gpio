import { sources } from "webpack";
import { CancellableLifeScope, LifeScope } from "../../lifeScope";
import { StateObservable } from "./stateObservable";
import { MutableStateObservable } from "./mutable/mutableStateObservable";
import { MutableStateObservableImpl } from "./mutable/mutableStateObservableImpl";

export class StateObservableExt {

    static map<I, O>(
            source: StateObservable<I>,
            lifeScope: LifeScope,
            transform: (value: I) => O,
    ): StateObservable<O> {
        let result: MutableStateObservable<O> = new MutableStateObservableImpl(transform(source.value))
        let isFirstValue = true
        source.observe(
             lifeScope,
            (value) => {
                if (isFirstValue) {
                    isFirstValue = false
                } else {
                    result.value = transform(value);
                }
            }
        )
        return result;
    }

    static runningFold<I, O>(
            source: StateObservable<I>,
            lifeScope: LifeScope,
            createInitial: (value: I) => O,
            operation: (acc: O, value: I) => O,
    ): StateObservable<O> {
        let isFirstValue = true
        let lastValue = source.value
        let result: MutableStateObservable<O> = new MutableStateObservableImpl(createInitial(lastValue));
        source.observe(
            lifeScope,
            (value: I) => {
                if (isFirstValue) {
                    isFirstValue = false;
                } else {
                    lastValue = value
                    let newValue = operation(result.value, value)
                    result.value = newValue
                }
            }
        )
        return result
    }

    static scoped<T>(
            source: StateObservable<T>,
            lifeScope: LifeScope,
    ): StateObservable<{ valueLifeScope: LifeScope, value: T }> {

        let createChildlifeScope: () => CancellableLifeScope = () => {
            let result = new CancellableLifeScope()
            lifeScope.onCancel(() => { result.cancel() })
            return result
        }

        let result: StateObservable<{ valueLifeScope: CancellableLifeScope, value: T }> = this.runningFold(
            source,
            lifeScope,
            (value) => {
                return {
                    valueLifeScope: createChildlifeScope(),
                    value: value
                }
            },
            (acc, value) => {
                acc.valueLifeScope.cancel()
                return {
                    valueLifeScope: createChildlifeScope(),
                    value: value
                }
            }
        )
        let typedResult: StateObservable<{ valueLifeScope: LifeScope, value: T }> = this.map(
             result,
            lifeScope,
            (scopeWithValue) => {
                let scope: LifeScope = scopeWithValue.valueLifeScope
                return {
                    valueLifeScope: scope,
                    value: scopeWithValue.value
                }
            }
        )
        return typedResult
    }
}