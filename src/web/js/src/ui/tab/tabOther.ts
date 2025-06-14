import { MqttSettings } from "../../data/settings";
import { LifeScope } from "../../utils/lifeScope";
import { createDiv } from "../../utils/ui/elements";
import { Input } from "../input";

export class TabOther {

    element: Element;

    private mdnsNameInput: Input<string>;

    constructor(
        lifeScope: LifeScope,
        initlaMdnsName: string,
    ) {

        this.mdnsNameInput = new Input<string>(
            "MDNS name",
            "mdns_name",
            "text",
            initlaMdnsName,
            (raw) => { return raw },
        );

        this.element = createDiv(
            [
                this.mdnsNameInput.element,
            ]
        )
    }

    get mdnsName(): string {
        return this.mdnsNameInput.value;
    }
}