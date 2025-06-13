import { LifeScope } from "./lifeScope";
import { MutableStateObservable } from "./observable/state/mutable/mutableStateObservable";
import { MutableStateObservableExt } from "./observable/state/mutable/mutableStateObservableExt";
import { MutableStateObservableImpl } from "./observable/state/mutable/mutableStateObservableImpl";
import { StateObservable } from "./observable/state/stateObservable";
import { StateObservableExt } from "./observable/state/stateObservableExt";

export class InProgressRegistry {

    private nextIndex: number = 0

    private activeIndexes: MutableStateObservable<number[]> =
        new MutableStateObservableImpl({ initialValue: [] })

    private _inProgress: StateObservable<boolean>

    constructor(
        args: {
            lifeScope: LifeScope,
        }
    ) {
        this._inProgress = StateObservableExt.map({
            source: this.activeIndexes,
            lifeScope: args.lifeScope,
            transform: (indexes) => indexes.length > 0
        })
    }

    get inProgress(): StateObservable<boolean> {
        return this._inProgress;
    }

    register(
        args: {
            promise: Promise<any>
        }
    ) {
        let index = this.nextIndex++
        MutableStateObservableExt.update({
            observable: this.activeIndexes,
            update: (value) => {
                return [...value, index]
            }
        })
        args.promise.then(
            (_) => {
                MutableStateObservableExt.update({
                    observable: this.activeIndexes,
                    update: (value) => {
                        return value.filter((number) => number !== index)
                    }
                })
            }
        )
    }
}