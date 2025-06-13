import { Cycle } from "../cycle/cycle";
import { None, Optional, Some } from "../utils/optional";
import { Repository } from "./repository"

export class FetchRepository implements Repository {

    async cycleList(): Promise<Optional<CycleName[]>> {
        return this.doRequest({
            path: "/cycle/list",
            transformReponse: (response) => JSON.parse(response),
        })
    }

    async getCycle(
        args: {
            name: CycleName;
        }
    ): Promise<Optional<Cycle>> {
        return this.doRequest({
            path: "/cycle/get",
            body: JSON.stringify({ name: args.name }),
            transformReponse: async (response) => {
                return Cycle.fromJSON({ jsonString: response })
            },
        })
    }

    async insertCycle(
        args: {
            name: CycleName;
            cycle: Cycle;
        }
    ): Promise<Optional<void>> {
        return this.doRequest({
            path: "/cycle/insert",
            body: JSON.stringify({
                name: args.name,
                cycle: args.cycle.toJSON(),
            }),
            transformReponse: async (_) => undefined,
        })
    }

    async removeCycle(
        args: {
            name: CycleName;
        }
    ): Promise<Optional<void>> {
        return this.doRequest({
            path: "/cycle/remove",
            body: JSON.stringify({ name: args.name }),
            transformReponse: async (_) => undefined,
        })
    }

    private async doRequest<R>(
        args: {
            path: string,
            body?: BodyInit,
            transformReponse: (response: string) => Promise<R>,
        }
    ): Promise<Optional<R>> {
        try {
            const response: Response = await fetch(
                args.path,
                {
                    body: args.body,
                    method: "POST"
                },
            );
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            let responseText = await response.text()
            console.log(`Received from ${args.path}: ${responseText}`)
            let result: R = await args.transformReponse(responseText)
            return new Some({ value: result });
        } catch (error) {
            console.log(`Unable fetch ${args.path}: ${error}`)
            return None.instance;
        }
    }

}