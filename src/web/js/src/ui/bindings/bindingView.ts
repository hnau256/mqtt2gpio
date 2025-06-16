import { Repository } from "../../data/repository";
import { Binding, BindingDirection, BindingType, Settings } from "../../data/settings";
import { InProgressRegistry } from "../../utils/inProgressRegistry";
import { LifeScope } from "../../utils/lifeScope";
import { Loadable, Loading, Ready } from "../../utils/loadable";
import { MutableStateObservable } from "../../utils/observable/state/mutable/mutableStateObservable";
import { MutableStateObservableImpl } from "../../utils/observable/state/mutable/mutableStateObservableImpl";
import { Optional, Some, None } from "../../utils/optional";
import { PromiseExt } from "../../utils/promiseExt";
import { displayErrorPanel } from "../../utils/ui/displayErrorPanel";
import { displayLoadingPanel } from "../../utils/ui/displayLoadingPanel";
import { displayState } from "../../utils/ui/displayState";
import { ButtonLevel, createA, createArticle, createButton, createDiv, createGroup, createHeader, createLabel, createLabelWithElement, createText, setLoading } from "../../utils/ui/elements";
import { MessageDisplayer } from "../../utils/ui/message/messagesDisplayer";
import { SelectView } from "../../utils/ui/selectView";
import { Input } from "../input";

export class BindingView {

    element: Element;

    private pin: Input<number>;
    private direction: SelectView<BindingDirection>;
    private topic: Input<string>;
    private type: SelectView<BindingType>;

    private mainModeElement: Element;

    constructor(
        lifeScope: LifeScope,
        id: string,
        initial: Binding,
        remove: () => void,
    ) {

        this.pin = new Input<number>(
            "Pin",
            id + "_pin",
            "number",
            initial.pin.toString(),
            (raw) => parseInt(raw),
        );

        this.direction = new SelectView(
            [BindingDirection.Subscribe, BindingDirection.Publish],
            initial.direction,
            (option, direction) => {
                switch (direction) {
                    case BindingDirection.Subscribe:
                        option.textContent = "Subscribe"
                        break;
                    case BindingDirection.Publish:
                        option.textContent = "Publish"
                        break;
                }
            }
        )

        this.topic = new Input<string>(
            "Topic",
            id + "_topic",
            "text",
            initial.topic,
            (raw) => raw,
        );



        this.type = new SelectView(
            [BindingType.Bool, BindingType.Float, BindingType.Tic],
            initial.type,
            (option, type) => {
                switch (type) {
                    case BindingType.Bool:
                        option.textContent = "bool"
                        break;
                    case BindingType.Float:
                        option.textContent = "float"
                        break;
                    case BindingType.Tic:
                        option.textContent = "tic"
                        break;
                }
            }
        )

        this.mainModeElement = createDiv(
            [
                createLabelWithElement(
                    id + "_type",
                    this.type.element,
                    [createText("Type")],
                ),
                this.pin.element,
                createLabelWithElement(
                    id + "_direction",
                    this.direction.element,
                    [createText("Direction")],
                ),
                this.topic.element,
                createButton(
                    "Remove",
                    () => { remove() },
                    ButtonLevel.Primary,
                    true,
                )
            ]
        )
        this.mainModeElement.className = "grid"

        this.element = createArticle([this.mainModeElement]);
    }

    get binding(): Binding {
        return {
            pin: this.pin.value,
            direction: this.direction.selected,
            topic: this.topic.value,
            type: this.type.selected,
        };
    }
}