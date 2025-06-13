import { LifeScope } from "../lifeScope";
import { Observable } from "./observable";

export class CallbackObservable<T> implements Observable<T> {

    private _observer: ( lifeScope: LifeScope, callback: (value: T) => void ) => void

    constructor(
            observer: (lifeScope: LifeScope, callback: (value: T) => void ) => void
    ) {
        this._observer = observer
    }

    observe(
            lifeScope: LifeScope,
            callback: (value: T) => void,
    ): void {
        this._observer(lifeScope, callback)
    }
}
