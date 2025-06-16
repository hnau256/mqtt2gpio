import { MqttSettings } from "../../data/settings";
import { LifeScope } from "../../utils/lifeScope";
import { createDiv } from "../../utils/ui/elements";
import { Input } from "../input";

export class TabMqtt {

    element: Element;

    private addresss: Input<string>;
    private port: Input<number>;
    private user: Input<string>;
    private password: Input<string>;
    private clientId: Input<string>;

    constructor(
        lifeScope: LifeScope,
        initialMqtt: MqttSettings,
    ) {

        this.addresss = new Input<string>(
            "Address",
            "address",
            "url",
            initialMqtt.address,
            (raw) => { return raw },
        );

        this.port = new Input<number>(
            "Port",
            "port",
            "number",
            initialMqtt.port.toString(),
            (raw) => { return parseInt(raw) },
        );

        this.user = new Input<string>(
            "User",
            "user",
            "text",
            initialMqtt.user,
            (raw) => { return raw },
        );

        this.password = new Input<string>(
            "Password",
            "password",
            "text",
            initialMqtt.password,
            (raw) => { return raw },
        );

        this.clientId = new Input<string>(
            "Client ID",
            "client_id",
            "text",
            initialMqtt.clientId,
            (raw) => { return raw },
        );

        this.element = createDiv(
            [
                this.addresss.element,
                this.port.element,
                this.user.element,
                this.password.element,
                this.clientId.element,
            ]
        )
    }

    get mqttSettings(): MqttSettings {
        return {
            address: this.addresss.value,
            port: this.port.value,
            user: this.user.value,
            password: this.password.value,
            clientId: this.clientId.value,
        }
    }
}