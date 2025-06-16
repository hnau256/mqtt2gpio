import { Repository } from "../data/repository";
import { Settings } from "../data/settings";
import { InProgressRegistry } from "../utils/inProgressRegistry";
import { LifeScope } from "../utils/lifeScope";
import { Loadable, Loading, Ready } from "../utils/loadable";
import { MutableStateObservableImpl } from "../utils/observable/state/mutable/mutableStateObservableImpl";
import { Optional, Some, None } from "../utils/optional";
import { PromiseExt } from "../utils/promiseExt";
import { displayErrorPanel } from "../utils/ui/displayErrorPanel";
import { displayLoadingPanel } from "../utils/ui/displayLoadingPanel";
import { displayState } from "../utils/ui/displayState";
import { ButtonLevel, createArticle, createButton, createDiv, createGroup, createHeader, createLabel, createText, setLoading } from "../utils/ui/elements";
import { MessageDisplayer } from "../utils/ui/message/messagesDisplayer";
import { Input } from "./input";
import { Tab } from "./tab/tab";
import { TabBindings } from "./tab/tabBindings";
import { displayTabButton } from "./tab/tabButton";
import { TabMqtt } from "./tab/tabMqtt";
import { TabOther } from "./tab/tabOther";

export function displaySettings(
    lifeScope: LifeScope,
    repository: Repository,
    settings: Settings,
    messagesDisplayer: MessageDisplayer,
): Element {

    let tabBindings = new TabBindings(
        lifeScope,
        settings.bindings,
    )

    let tabMqtt = new TabMqtt(
        lifeScope,
        settings.mqtt,
    )

    let tabOther = new TabOther(
        lifeScope,
        settings.mdns_name,
    )

    let tabHolder = createDiv();

    let selectedTab = new MutableStateObservableImpl(Tab.Bindings)

    let header = createDiv(
        [
            createGroup(
                [
                    displaySaveButton(
                        lifeScope,
                        repository,
                        messagesDisplayer,
                        () => {
                            return {
                                mdns_name: tabOther.mdnsName,
                                mqtt: tabMqtt.mqttSettings,
                                bindings: tabBindings.bindings,
                            }
                        }
                    )
                ]
            ),
            createGroup(
                [
                    displayTabButton(
                        lifeScope,
                        "Bindings",
                        Tab.Bindings,
                        selectedTab,
                    ),
                    displayTabButton(
                        lifeScope,
                        "MQTT",
                        Tab.Mqtt,
                        selectedTab,
                    ),
                    displayTabButton(
                        lifeScope,
                        "Other",
                        Tab.Other,
                        selectedTab,
                    )
                ]
            ),
        ]
    )
    header.className = "grid"

    tabHolder = createDiv()

    selectedTab.observe(
        lifeScope,
        tab => {
            let element: Element
            switch (tab) {
                case Tab.Bindings:
                    element = tabBindings.element;
                    break;
                case Tab.Mqtt:
                    element = tabMqtt.element;
                    break;
                case Tab.Other:
                    element = tabOther.element;
                    break;
            }
            tabHolder.replaceChildren(element);
        }
    )

    return createDiv(
        [
            header,
            tabHolder,
        ]
    );
}

function displaySaveButton(
    lifeScope: LifeScope,
    repository: Repository,
    messagesDisplayer: MessageDisplayer,
    collectNewSettings: () => Settings,
) {
    let isSaving = new InProgressRegistry(lifeScope);
    let saveButton = createButton(
        "Save and restart",
        () => {
            let newSettings: Settings = collectNewSettings()
            let savePromise = repository.setSettingsAndRestart(newSettings);
            isSaving.register(savePromise)
            PromiseExt.awaitPromise(
                lifeScope,
                savePromise,
                (removedOrNone: Optional<void>) => {
                    removedOrNone.fold(
                        () => {
                            messagesDisplayer.displayMessage(`Unable save settings`)
                        },
                        (_) => {
                            window.location.reload()
                        }
                    )
                }
            )
        },
    )
    setLoading(
        lifeScope,
        saveButton,
        isSaving.inProgress,
    )
    return saveButton
}