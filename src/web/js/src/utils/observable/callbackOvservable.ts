import { LifeScope } from "../lifeScope";
import { Observable } from "./observable";

export class CallbackObservable<T> implements Observable<T> {

    private _observer: (args: { lifeScope: LifeScope, callback: (value: T) => void }) => void

    constructor(
        args: {
            observer: (args: { lifeScope: LifeScope, callback: (value: T) => void }) => void
        }
    ) {
        this._observer = args.observer
    }

    observe(
        args: {
            lifeScope: LifeScope;
            callback: (value: T) => void;
        }
    ): void {
        this._observer({
            lifeScope: args.lifeScope,
            callback: args.callback,
        })
    }
}
