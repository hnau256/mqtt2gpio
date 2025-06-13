import { Cycle } from "../cycle/cycle";
import { Optional } from "../utils/optional";

export interface Repository {

    cycleList(): Promise<Optional<CycleName[]>>

    getCycle(
        args: {
            name: CycleName,
        },
    ): Promise<Optional<Cycle>>

    insertCycle(
        args: {
            name: CycleName,
            cycle: Cycle,
        },
    ): Promise<Optional<void>>

    removeCycle(
        args: {
            name: CycleName,
        },
    ): Promise<Optional<void>>
}