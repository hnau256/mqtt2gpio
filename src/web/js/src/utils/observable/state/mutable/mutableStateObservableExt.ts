import { MutableStateObservable } from "./mutableStateObservable";

export class MutableStateObservableExt {

    static update<T>(
            observable: MutableStateObservable<T>,
            update: (value: T) => T,
    ) {
        observable.value = update(observable.value)
    } 
}