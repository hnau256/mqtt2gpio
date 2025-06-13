import { Cycle } from "../cycle/cycle";
import { None, Optional, Some } from "../utils/optional";
import { Repository } from "./repository";

export class MockRepository implements Repository {

    async cycleList(): Promise<Optional<CycleName[]>> {
        await this.pause()
        return new Some({
            value: ["Cycle1", "Cycle2", "Cycle3"]
        });
    }

    async getCycle(
        args: {
            name: CycleName;
        }
    ): Promise<Optional<Cycle>> {
        await this.pause()
        return new Some({
            value: new Cycle({
                items: [
                        {
                            duration_minutes: 620,
                            target: 800,
                        },
                        {
                            duration_minutes: 760,
                            target: 1000,
                        },
                        {
                            duration_minutes: 300,
                            target: 0,
                        },
                ],
            })
        })
    }

    async insertCycle(
        args: {
            name: CycleName;
            cycle: Cycle;
        }
    ): Promise<Optional<void>> {
        await this.pause()
        return new Some({ value: undefined })
    }

    async removeCycle(
        args: {
            name: CycleName;
        }
    ): Promise<Optional<void>> {
        await this.pause()
        return new Some({ value: undefined })
    }

    private async pause(): Promise<void> {
        await new Promise(f => setTimeout(f, 500));
    }
}