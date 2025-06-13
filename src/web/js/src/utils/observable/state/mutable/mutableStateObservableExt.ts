import { MutableStateObservable } from "./mutableStateObservable";

export class MutableStateObservableExt {

    static update<T>(
        args: {
            observable: MutableStateObservable<T>,
            update: (value: T) => T,
        }
    ) {
        args.observable.value = args.update(args.observable.value)
    } 
}