import { CycleItem } from "./cycleItem";

export class Cycle {

    items: CycleItem[]

    constructor(
        args: {
            items: CycleItem[]
        }
    ) {
        this.items = args.items
    }

    toJSON(): CycleItem[] {
        return this.items
    }

    static fromJSON(
        args: {
            jsonString: string
        }
    ): Cycle {
        return new Cycle({
            items: JSON.parse(args.jsonString),
        })
    }
}