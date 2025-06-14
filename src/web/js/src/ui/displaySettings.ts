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
import { createArticle, createButton, createDiv, createElement, createHeader, createLabel, createText, setLoading } from "../utils/ui/elements";
import { MessageDisplayer } from "../utils/ui/message/messagesDisplayer";

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

    let isSaving = new InProgressRegistry(lifeScope);
    let saveButton = createButton(
        "Save and restart",
        () => {
            let newSettings: Settings = {
                mdns_name: mdnsName.value,
                mqtt: {
                    address: mqttAddress.value,
                    port: mqttPort.value,
                    user: mqttUser.value,
                    password: mqttPassword.value,
                },
                bindings: [],
            }
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
    return createDiv(
        [
            mdnsName.element,
            createArticle(
                [
                    mqttAddress.element,
                    mqttPort.element,
                    mqttUser.element,
                    mqttPassword.element,
                ]
            ),
            saveButton,
        ]
    );
}

class Input<T> {
    private input: HTMLInputElement;
    private decoder: (raw: string) => T;

    element: Element;

    constructor(
        title: string,
        id: string,
        type: string,
        initial: string,
        decoder: (raw: string) => T,
    ) {
        this.decoder = decoder;
        let input = document.createElement("input");
        this.input = input;
        input.setAttribute("id", id);
        input.setAttribute("type", type);
        input.setAttribute("value", initial);
        this.element = createDiv(
            [
                createLabel(
                    id,
                    [createText(title)]
                ),
                input,
            ]
        )
    }

    public get value(): T {
        let raw: string = this.input.value;
        return this.decoder(raw);
    }
}