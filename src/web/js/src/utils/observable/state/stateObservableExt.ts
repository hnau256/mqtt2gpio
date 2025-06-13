import { sources } from "webpack";
import { CancellableLifeScope, LifeScope } from "../../lifeScope";
import { StateObservable } from "./stateObservable";
import { MutableStateObservable } from "./mutable/mutableStateObservable";
import { MutableStateObservableImpl } from "./mutable/mutableStateObservableImpl";

export class StateObservableExt {

    static map<I, O>(
        args: {
            source: StateObservable<I>,
            lifeScope: LifeScope,
            transform: (value: I) => O
        }
    ): StateObservable<O> {
        let result: MutableStateObservable<O> = new MutableStateObservableImpl({
            initialValue: args.transform(args.source.value)
        })
        let isFirstValue = true
        args.source.observe({
            lifeScope: args.lifeScope,
            callback: (value) => {
                if (isFirstValue) {
                    isFirstValue = false
                } else {
                    result.value = args.transform(value);
                }
            }
        })
        return result;
    }

    static runningFold<I, O>(
        args: {
            source: StateObservable<I>,
            lifeScope: LifeScope,
            createInitial: (value: I) => O,
            operation: (acc: O, value: I) => O,
        }
    ): StateObservable<O> {
        let isFirstValue = true
        let lastValue = args.source.value
        let result: MutableStateObservable<O> = new MutableStateObservableImpl({
            initialValue: args.createInitial(lastValue)
        });
        args.source.observe({
            lifeScope: args.lifeScope,
            callback: (value: I) => {
                if (isFirstValue) {
                    isFirstValue = false;
                } else {
                    lastValue = value
                    let newValue = args.operation(result.value, value)
                    result.value = newValue
                }
            }
        })
        return result
    }

    static scoped<T>(
        args: {
            source: StateObservable<T>,
            lifeScope: LifeScope,
        }
    ): StateObservable<{ valueLifeScope: LifeScope, value: T }> {

        let createChildlifeScope: () => CancellableLifeScope = () => {
            let result = new CancellableLifeScope()
            args.lifeScope.onCancel({
                callback: () => { result.cancel }
            })
            return result
        }

        let result: StateObservable<{ valueLifeScope: CancellableLifeScope, value: T }> = this.runningFold({
            source: args.source,
            lifeScope: args.lifeScope,
            createInitial: (value) => {
                return {
                    valueLifeScope: createChildlifeScope(),
                    value: value
                }
            },
            operation: (acc, value) => {
                acc.valueLifeScope.cancel()
                return {
                    valueLifeScope: createChildlifeScope(),
                    value: value
                }
            }
        })
        let typedResult: StateObservable<{ valueLifeScope: LifeScope, value: T }> = this.map({
            source: result,
            lifeScope: args.lifeScope,
            transform: (scopeWithValue) => {
                let scope: LifeScope = scopeWithValue.valueLifeScope
                return {
                    valueLifeScope: scope,
                    value: scopeWithValue.value
                }
            }
        })
        return typedResult
    }
}