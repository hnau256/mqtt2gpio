import { Repository } from "../data/repository";
import { Settings } from "../data/settings";
import { LifeScope } from "../utils/lifeScope";
import { Loadable, Loading, Ready } from "../utils/loadable";
import { MutableStateObservableImpl } from "../utils/observable/state/mutable/mutableStateObservableImpl";
import { Optional, Some, None } from "../utils/optional";
import { PromiseExt } from "../utils/promiseExt";
import { displayErrorPanel } from "../utils/ui/displayErrorPanel";
import { displayLoadingPanel } from "../utils/ui/displayLoadingPanel";
import { displayState } from "../utils/ui/displayState";
import { MessageDisplayer } from "../utils/ui/message/messagesDisplayer";
import { displaySettings } from "./displaySettings";

export function displayLoadSettings(
    lifeScope: LifeScope,
    repository: Repository,
    messagesDisplayer: MessageDisplayer,
): Element {
    let state = new MutableStateObservableImpl<Loadable<Optional<Settings>>>(Loading.instance);
    return displayState(
        lifeScope,
        state,
        (stateLifeScope, currentState: Loadable<Optional<Settings>>) => {
            return currentState.fold(
                () => {
                    return displayInactiveLoading(
                        stateLifeScope,
                        repository,
                        (settings) => { state.value = new Ready(new Some(settings)) },
                        () => { state.value = new Ready(None.instance) }
                    );
                },
                (settingsOrNone) => {
                    return settingsOrNone.fold(
                        () => {
                            return displayInactiveError(
                                () => { state.value = Loading.instance }
                            )
                        },
                        (settings) => {
                            return displaySettings(
                                stateLifeScope,
                                repository,
                                settings,
                                messagesDisplayer,
                            )
                        },
                    )
                }
            )
        }
    )
}

function displayInactiveLoading(
    lifeScope: LifeScope,
    repository: Repository,
    onSettingsLoaded: (settings: Settings) => void,
    onError: () => void,
): Element {
    PromiseExt.awaitPromise(
        lifeScope,
        repository.getSettings(),
        (settingsOrNone) => {
            settingsOrNone.fold(onError, onSettingsLoaded)
        }
    )
    return displayLoadingPanel("Loading settings");
}

function displayInactiveError(
    tryAgain: () => void,
): Element {
    return displayErrorPanel(
        "Unable load settings",
        {
            text: "Try again",
            onClick: tryAgain
        }
    )
}