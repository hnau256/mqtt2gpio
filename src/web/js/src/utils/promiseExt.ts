import { LifeScope } from "./lifeScope";

export class PromiseExt {

    static awaitPromise<T>(
        args: {
            lifeScope: LifeScope,
            promise: Promise<T>,
            callback: (value: T) => void,
        }
    ): void {
        let completed = false;
        args.lifeScope.onCancel({
            callback: () => completed = true
        })
        if (completed) {
            return
        }
        args.promise.then(
            (value) => {
                if (!completed) {
                    args.callback(value)
                }
            }
        )
    }
}