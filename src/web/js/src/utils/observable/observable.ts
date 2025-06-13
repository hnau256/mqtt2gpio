import { CancellableLifeScope, LifeScope } from "../lifeScope";

export interface Observable<T> {

    observe(
            lifeScope: LifeScope,
            callback: (value: T) => void,
    ): void;
}