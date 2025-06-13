import { LifeScope } from "./lifeScope";
import { MutableStateObservable } from "./observable/state/mutable/mutableStateObservable";
import { MutableStateObservableExt } from "./observable/state/mutable/mutableStateObservableExt";
import { MutableStateObservableImpl } from "./observable/state/mutable/mutableStateObservableImpl";
import { StateObservable } from "./observable/state/stateObservable";
import { StateObservableExt } from "./observable/state/stateObservableExt";

export class InProgressRegistry {

    private nextIndex: number = 0

    private activeIndexes: MutableStateObservable<number[]> =
        new MutableStateObservableImpl([])

    private _inProgress: StateObservable<boolean>

    constructor(
            lifeScope: LifeScope,
    ) {
        this._inProgress = StateObservableExt.map(
            this.activeIndexes,
            lifeScope,
            (indexes) => indexes.length > 0
        )
    }

    get inProgress(): StateObservable<boolean> {
        return this._inProgress;
    }

    register(
            promise: Promise<any>,
    ) {
        let index = this.nextIndex++
        MutableStateObservableExt.update(
            this.activeIndexes,
             (value) => {
                return [...value, index]
             }
        )
        promise.then(
            (_) => {
                MutableStateObservableExt.update(
                    this.activeIndexes,
                    (value) => {
                        return value.filter((number) => number !== index)
                    }
                )
            }
        )
    }
}