import { StateObservable } from "../stateObservable";
import { MutableStateObservableImpl } from "./mutableStateObservableImpl";


export interface MutableStateObservable<T> extends StateObservable<T> {

    set value(value: T);
}