import { Cycle } from "../cycle/cycle";
import { isDebug } from "../utils/is_debug";
import { MutableStateObservableImpl } from "../utils/observable/state/mutable/mutableStateObservableImpl";
import { StateObservable } from "../utils/observable/state/stateObservable";
import { Optional } from "../utils/optional";
import { CacheCyclesRepository } from "./cacheCyclesRepository";
import { FetchRepository } from "./fetchRepository";
import { MockRepository } from "./mockRepository";
import { Repository } from "./repository";

export enum RepositoryType { Fetch, Mock }

export interface RepositoryTypeSwitcher {

    repositoryType: StateObservable<RepositoryType>

    switchRepositoryType(
        args: {
            type: RepositoryType
        }
    ): void
}

export class SwitchRepository implements Repository, RepositoryTypeSwitcher {

    repositoryType: MutableStateObservableImpl<RepositoryType> = new MutableStateObservableImpl({
        initialValue: isDebug
            ? RepositoryType.Mock
            : RepositoryType.Fetch
    })

    repositoriesCache = new Map<RepositoryType, Repository>()

    switchRepositoryType(
        args: {
            type: RepositoryType
        }
    ): void {
        this.repositoryType.value = args.type
    }

    cycleList(): Promise<Optional<CycleName[]>> {
        return this.getCurrentRepository().cycleList()
    }

    getCycle(
        args: {
            name: CycleName;
        }
    ): Promise<Optional<Cycle>> {
        return this.getCurrentRepository().getCycle(args)
    }

    insertCycle(
        args: {
            name: CycleName;
            cycle: Cycle;
        }
    ): Promise<Optional<void>> {
        return this.getCurrentRepository().insertCycle(args)
    }

    removeCycle(
        args: {
            name: CycleName;
        }
    ): Promise<Optional<void>> {
        return this.getCurrentRepository().removeCycle(args)
    }

    getCurrentRepository(): Repository {
        let repositoryType = this.repositoryType.value
        let result = this.repositoriesCache.get(repositoryType)
        if (!result) {
            switch (repositoryType) {
                case RepositoryType.Fetch:
                    result = new FetchRepository();
                    break;
                case RepositoryType.Mock:
                    result = new MockRepository();
                    break;
            }
            result = new CacheCyclesRepository({
                source: result
            })
            this.repositoriesCache.set(repositoryType, result)
        }
        return result
    }
}