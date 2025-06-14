import { MqttSettings } from "../../data/settings";
import { LifeScope } from "../../utils/lifeScope";
import { createDiv } from "../../utils/ui/elements";
import { Input } from "../input";

export class TabMqtt {

    element: Element;

    private mqttAddress: Input<string>;
    private mqttPort: Input<number>;
    private mqttUser: Input<string>;
    private mqttPassword: Input<string>;

    constructor(
        lifeScope: LifeScope,
        initialMqtt: MqttSettings,
    ) {

        this.mqttAddress = new Input<string>(
            "Address",
            "address",
            "url",
            initialMqtt.address,
            (raw) => { return raw },
        );

        this.mqttPort = new Input<number>(
            "Port",
            "port",
            "number",
            initialMqtt.port.toString(),
            (raw) => { return parseInt(raw) },
        );

        this.mqttUser = new Input<string>(
            "User",
            "user",
            "text",
            initialMqtt.user,
            (raw) => { return raw },
        );

        this.mqttPassword = new Input<string>(
            "Password",
            "password",
            "text",
            initialMqtt.password,
            (raw) => { return raw },
        );

        this.element = createDiv(
            [
                this.mqttAddress.element,
                this.mqttPort.element,
                this.mqttUser.element,
                this.mqttPassword.element,
            ]
        )
    }

    get mqttSettings(): MqttSettings {
        return {
            address: this.mqttAddress.value,
            port: this.mqttPort.value,
            user: this.mqttUser.value,
            password: this.mqttPassword.value,
        }
    }
}