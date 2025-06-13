import { displayErrorPanel } from "../utils/displayErrorPanel"
import { displayLoadingPanel } from "../utils/displayLoadingPanel"
import { displayState } from "../utils/displayState";
import { LifeScope } from "../../../utils/lifeScope";
import { Repository } from "../../../repository/repository";
import { Loadable, Loading, Ready } from "../../../utils/loadable";
import { None, Optional, Some } from "../../../utils/optional";
import { PromiseExt } from "../../../utils/promiseExt";
import { displayCyclesList } from "./loadList/list/displayCyclesList";
import { Either, Left, Right } from "../../../utils/either";
import { Cycle } from "../../../cycle/cycle";
import { displayLoadList } from "./loadList/displayLoadList";
import { displayCycle } from "./cycle/displayCycle";
import { MessageDisplayer } from "../utils/message/messagesDisplayer";
import { MutableStateObservableImpl } from "../../../utils/observable/state/mutable/mutableStateObservableImpl";

export function displayInactive(
    args: {
        lifeScope: LifeScope,
        repository: Repository,
        messagesDisplayer: MessageDisplayer,
        switchToActive: () => void,
    }
): Element {
    let state = new MutableStateObservableImpl<Either<Optional<{ name: CycleName, cycle: Cycle }>, void>>({
        initialValue: new Right({ value: undefined })
    });
    return displayState({
        lifeScope: args.lifeScope,
        state: state,
        display: (stateLifeScope, currentState: Either<Optional<{ name: CycleName, cycle: Cycle }>, void>) => {
            return currentState.fold({
                ifLeft: (editableCycleOrNone: Optional<{ name: CycleName, cycle: Cycle }>) => displayCycle({
                    lifeScope: stateLifeScope,
                    repository: args.repository,
                    messagesDisplayer: args.messagesDisplayer,
                    cycleToEditOrNone: editableCycleOrNone,
                    returnToList: () => {
                        state.value = new Right({ value: undefined })
                    },
                }),
                ifRight: (_) => displayLoadList({
                    lifeScope: stateLifeScope,
                    repository: args.repository,
                    messagesDisplayer: args.messagesDisplayer,
                    createNewCycle: () => {
                        state.value = new Left({
                            value: None.instance
                        })
                    },
                    editCycle: (nameWithCycle) => {
                        state.value = new Left({
                            value: new Some({
                                value: {
                                    name: nameWithCycle.name,
                                    cycle: nameWithCycle.cycle
                                }
                            })
                        })
                    },
                })
            })
        }
    })
}