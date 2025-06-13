import { Cycle } from "../cycle/cycle";
import { None, Optional, Some } from "../utils/optional";
import { Repository } from "./repository";

export class CacheCyclesRepository implements Repository {

    private cycles: Optional<Map<CycleName, Optional<Cycle>>> = None.instance

    private source: Repository

    constructor(
        args: {
            source: Repository
        }
    ) {
        this.source = args.source
    }

    cycleList(): Promise<Optional<CycleName[]>> {
        return this.cycles.fold<Promise<Optional<CycleName[]>>>({
            ifSome: async (cycles: Map<CycleName, Optional<Cycle>>) => {
                let names: CycleName[] = Array.from(cycles.keys())
                let someNames: Optional<CycleName[]> = new Some({ value: names })
                return someNames
            },
            ifNone: async () => {
                let namesOrNone: Optional<CycleName[]> = await this.source.cycleList()
                return namesOrNone.map({
                    transform: (names: CycleName[]) => {
                        this.cycles = new Some({
                            value: new Map(
                                names.map((name) => [name, None.instance])
                            )
                        })
                        return names
                    }
                })
            },
        })
    }

    async getCycle(
        args: {
            name: CycleName;
        }
    ): Promise<Optional<Cycle>> {
        let result: Cycle | undefined = this.cycles.fold({
            ifSome: (cycles) => cycles.get(args.name)?.fold({
                ifNone: () => undefined,
                ifSome: (cycle) => cycle
            }),
            ifNone: () => undefined
        });
        if (result) {
            return new Some({ value: result })
        }
        let cyclesOrNone = await this.source.getCycle(args)
        return cyclesOrNone.map({
            transform: (cycle) => {
                this.cycles.map({
                    transform: (cycles) => {
                        let someCycle = new Some({value: cycle})
                        cycles.set(args.name, someCycle)
                    }
                })
                return cycle
            }
        })
    }

    async insertCycle(
        args: {
            name: CycleName;
            cycle: Cycle;
        }
    ): Promise<Optional<void>> {
        return (await this.source.insertCycle(args)).map({
            transform: (result) => {
                this.cycles.map({
                    transform: (cycles) => {
                        let someCycle = new Some({value: args.cycle})
                        cycles.set(args.name, someCycle)
                    }
                })
                return result
            }
        })
    }

    async removeCycle(
        args: {
            name: CycleName;
        }
    ): Promise<Optional<void>> {
        return (await this.source.removeCycle(args)).map({
            transform: (result) => {
                this.cycles.map({
                    transform: (cycles) => {
                        cycles.delete(args.name)
                    }
                })
                return result
            }
        })
    }
}