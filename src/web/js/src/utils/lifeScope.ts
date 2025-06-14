export interface LifeScope {

    onCancel(
        callback: () => void,
    ): void
}

export let ImmortalLifeScope: LifeScope = {
    onCancel: function (
        callback: () => void
    ): void { }
}

export class CancellableLifeScope implements LifeScope {

    isCancelled = false;

    callbacks: Array<() => void> = []

    onCancel(
        callback: () => void,
    ): void {
        if (this.isCancelled) {
            callback()
        } else {
            this.callbacks.push(callback);
        }
    }

    cancel() {
        if (this.isCancelled) {
            return
        }
        this.isCancelled = true
        this.callbacks.forEach((callback) => { callback() })
        this.callbacks.length = 0;
    }

    static create(
        parent: LifeScope,
    ): CancellableLifeScope {
        let result = new CancellableLifeScope()
        parent.onCancel(
            () => { result.cancel() }
        )
        return result
    }
}