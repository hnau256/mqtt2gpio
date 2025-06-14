import { Repository } from "../data/repository";
import { isDebug } from "../utils/is_debug";
import { LifeScope } from "../utils/lifeScope";
import { StateObservableExt } from "../utils/observable/state/stateObservableExt";
import { createArticle, createDetails, createDiv, createLabel, createSwitch, createText } from "../utils/ui/elements";
import { MessagesStack } from "../utils/ui/message/messagesStack";
import { displayLoadSettings } from "./displayLoadSettings";

export function displayApp(
    lifeScope: LifeScope,
    repository: Repository,
): Element {
    let container = createDiv()
    let messagesStack = new MessagesStack()
    container.appendChild(
        messagesStack.display(lifeScope)
    )
    container.appendChild(
        displayLoadSettings(
            lifeScope,
            repository,
            messagesStack
        )
    )
    return container
}