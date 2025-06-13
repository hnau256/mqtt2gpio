export interface LifeScope {

    onCancel(
        args: {
            callback: () => void
        }
    ): void
}

export let ImmortalLifeScope: LifeScope = {
    onCancel: function (args: {
        callback: () => void
    }): void { }
}

export class CancellableLifeScope implements LifeScope {

    isCancelled = false;

    callbacks: Array<() => void> = []

    onCancel(
        args: {
            callback: () => void
        }
    ): void {
        if (this.isCancelled) {
            args.callback()
        } else {
            this.callbacks.push(args.callback);
        }
    }

    cancel() {
        this.isCancelled = true
        this.callbacks.forEach((callback) => { callback() })
        this.callbacks.length = 0;
    }
}