import { CancellableLifeScope, LifeScope } from "../lifeScope";

export interface Observable<T> {

    observe(
        args: {
            lifeScope: LifeScope,
            callback: (value: T) => void,
        }
    ): void;
}