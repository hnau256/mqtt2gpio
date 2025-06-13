import { displayErrorPanel } from "../../utils/displayErrorPanel"
import { displayLoadingPanel } from "../../utils/displayLoadingPanel"
import { displayState } from "../../utils/displayState";
import { LifeScope } from "../../../../utils/lifeScope";
import { Repository } from "../../../../repository/repository";
import { Loadable, Loading, Ready } from "../../../../utils/loadable";
import { None, Optional, Some } from "../../../../utils/optional";
import { PromiseExt } from "../../../../utils/promiseExt";
import { displayCyclesList } from "./list/displayCyclesList";
import { Cycle } from "../../../../cycle/cycle";
import { MessageDisplayer } from "../../utils/message/messagesDisplayer";
import { MutableStateObservableImpl } from "../../../../utils/observable/state/mutable/mutableStateObservableImpl";

export function displayLoadList(
    args: {
        lifeScope: LifeScope,
        repository: Repository,
        messagesDisplayer: MessageDisplayer,
        createNewCycle: () => void,
        editCycle: (value: {name: CycleName, cycle: Cycle}) => void,
    }
): Element {
    let state = new MutableStateObservableImpl<Loadable<Optional<CycleName[]>>>({
        initialValue: Loading.instance
    });
    return displayState({
        lifeScope: args.lifeScope,
        state: state,
        display: (stateLifeScope, currentState: Loadable<Optional<CycleName[]>>) => {
            return currentState.fold({
                ifLoading: () => {
                    return displayInactiveLoading({
                        lifeScope: stateLifeScope,
                        repository: args.repository,
                        onCyclesLoaded: (cyclesList) => {
                            state.value = new Ready({
                                value: new Some({
                                    value: cyclesList
                                })
                            })

                        },
                        onError: () => {
                            state.value = new Ready({
                                value: None.instance
                            })
                        }
                    });
                },
                ifReady: (cyclesOrNone) => {
                    return cyclesOrNone.fold({
                        ifNone: () => {
                            return displayInactiveError({
                                tryAgain: () => { state.value = Loading.instance }
                            })
                        },
                        ifSome: (cycles) => {
                            return displayCyclesList({
                                lifeScope: stateLifeScope,
                                repository: args.repository,
                                cycles: cycles,
                                messagesDisplayer: args.messagesDisplayer,
                                createNewCycle: args.createNewCycle,
                                editCycle: args.editCycle,
                            })
                        },
                    })
                }
            })
        }
    })
}

function displayInactiveLoading(
    args: {
        lifeScope: LifeScope,
        repository: Repository,
        onCyclesLoaded: (cycles: CycleName[]) => void,
        onError: () => void,
    }
): Element {
    PromiseExt.awaitPromise({
        lifeScope: args.lifeScope,
        promise: args.repository.cycleList(),
        callback: (cyclesOrNone) => {
            cyclesOrNone.fold({
                ifNone: args.onError,
                ifSome: args.onCyclesLoaded
            })
        }
    })
    return displayLoadingPanel({
        text: "Loading cycles list",
    });
}

function displayInactiveError(
    args: {
        tryAgain: () => void,
    }
): Element {
    return displayErrorPanel({
        text: "Unable load cycles list",
        button: {
            text: "Try again",
            onClick: args.tryAgain
        }
    })
}