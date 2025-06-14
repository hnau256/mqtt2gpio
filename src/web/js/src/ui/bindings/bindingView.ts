import { Repository } from "../../data/repository";
import { Binding, Settings } from "../../data/settings";
import { InProgressRegistry } from "../../utils/inProgressRegistry";
import { LifeScope } from "../../utils/lifeScope";
import { Loadable, Loading, Ready } from "../../utils/loadable";
import { MutableStateObservableImpl } from "../../utils/observable/state/mutable/mutableStateObservableImpl";
import { Optional, Some, None } from "../../utils/optional";
import { PromiseExt } from "../../utils/promiseExt";
import { displayErrorPanel } from "../../utils/ui/displayErrorPanel";
import { displayLoadingPanel } from "../../utils/ui/displayLoadingPanel";
import { displayState } from "../../utils/ui/displayState";
import { createArticle, createButton, createDiv, createElement, createHeader, createLabel, createText, setLoading } from "../../utils/ui/elements";
import { MessageDisplayer } from "../../utils/ui/message/messagesDisplayer";

export class BindingView {

    element: Element;
    initial: Binding;

    constructor(
        lifeScope: LifeScope,
        initial: Binding,
        remove: () => void,
    ) {
        this.initial = initial;
        this.element = createDiv(
            [
                createArticle(
                    [
                        createHeader(4, "Binding")
                    ]
                )
            ]
        )
    }

    get binding(): Binding {
        return this.initial;
    }
}