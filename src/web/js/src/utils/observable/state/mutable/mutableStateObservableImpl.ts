import { LifeScope } from "../../../lifeScope";

export class MutableStateObservableImpl<T> {

    private callbackIndex: number = 0;

    private _value: T

    private callbacks: Map<Number, (value: T) => void> = new Map()

    constructor(
        args: {
            initialValue: T
        }
    ) {
        this._value = args.initialValue;
    }

    observe(
        args: {
            lifeScope: LifeScope,
            callback: (value: T) => void,
        }
    ): void {
        let index = this.callbackIndex++;
        this.callbacks.set(index, args.callback);
        args.lifeScope.onCancel({
            callback: () => { this.callbacks.delete(index) }
        })
        args.callback(this._value);
    }

    get value(): T {
        return this._value
    }

    set value(value: T) {
        if (this._value != value) {
            this._value = value;
            this.callbacks.forEach((callback) => { callback(this._value) })
        }
    }
}