import { LifeScope } from "../../../lifeScope";

export class MutableStateObservableImpl<T> {

    private callbackIndex: number = 0;

    private _value: T

    private callbacks: Map<Number, (value: T) => void> = new Map()

    constructor(
            initialValue: T
    ) {
        this._value = initialValue;
    }

    observe(
            lifeScope: LifeScope,
            callback: (value: T) => void,
    ): void {
        let index = this.callbackIndex++;
        this.callbacks.set(index, callback);
        lifeScope.onCancel(
            () => { this.callbacks.delete(index) }
        )
        callback(this._value);
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