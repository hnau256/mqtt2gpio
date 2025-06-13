import { LifeScope } from "./lifeScope";

export class PromiseExt {

    static awaitPromise<T>(
            lifeScope: LifeScope,
            promise: Promise<T>,
            callback: (value: T) => void,
    ): void {
        let completed = false;
        lifeScope.onCancel(() => completed = true)
        if (completed) {
            return
        }
        promise.then(
            (value) => {
                if (!completed) {
                    callback(value)
                }
            }
        )
    }
}