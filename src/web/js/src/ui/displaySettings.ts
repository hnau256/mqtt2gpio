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
import { ButtonLevel, createArticle, createButton, createDiv, createElement, createHeader, createLabel, createText, setLoading } from "../utils/ui/elements";
import { MessageDisplayer } from "../utils/ui/message/messagesDisplayer";
import { BindingsView } from "./bindingsView";
import { Input } from "./input";

export function displaySettings(
    lifeScope: LifeScope,
    repository: Repository,
    settings: Settings,
    messagesDisplayer: MessageDisplayer,
): Element {

    let mdnsName = new Input<string>(
        "MDNS name",
        "mdns_name",
        "text",
        settings.mdns_name,
        (raw) => { return raw },
    );

    let mqttAddress = new Input<string>(
        "MQTT address",
        "mqtt_address",
        "url",
        settings.mqtt.address,
        (raw) => { return raw },
    );

    let mqttPort = new Input<number>(
        "MQTT port",
        "mqtt_port",
        "number",
        settings.mqtt.port.toString(),
        (raw) => { return parseInt(raw) },
    );

    let mqttUser = new Input<string>(
        "MQTT user",
        "mqtt_user",
        "text",
        settings.mqtt.user,
        (raw) => { return raw },
    );

    let mqttPassword = new Input<string>(
        "MQTT password",
        "mqtt_password",
        "password",
        settings.mqtt.password,
        (raw) => { return raw },
    );

    let bindings = new BindingsView(
        lifeScope,
        settings.bindings,
    )

    let header = createDiv(
        [
            createButton(
                "Bindings", 
                () => {},
                ButtonLevel.Secondary,
                true,
            ),
            createButton(
                "Mqtt", 
                () => {},
                ButtonLevel.Secondary,
                false,
            ),
            createButton(
                "Other", 
                () => {},
                ButtonLevel.Secondary,
                true,
            ),
            createButton(
                "Save", 
                () => {},
            ),
        ]
    )
    header.className = "grid"

    return createDiv(
        [
            header,
            displaySaveButton(
                lifeScope,
                repository,
                messagesDisplayer,
                () => {
                    return {
                        mdns_name: mdnsName.value,
                        mqtt: {
                            address: mqttAddress.value,
                            port: mqttPort.value,
                            user: mqttUser.value,
                            password: mqttPassword.value,
                        },
                        bindings: [],
                    }
                }
            ),
            mdnsName.element,
            createArticle(
                [
                    mqttAddress.element,
                    mqttPort.element,
                    mqttUser.element,
                    mqttPassword.element,
                ]
            ),
            bindings.element,
            createButton(
                "Add binding",
                () => bindings.addBinding(),
            ),
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