import { LifeScope } from "../../lifeScope";
import { Observable } from "../observable";

export interface StateObservable<T> extends Observable<T> {

    get value(): T;

}

