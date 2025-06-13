import { isDebug } from "../utils/is_debug";
import { LifeScope } from "../utils/lifeScope";
import { StateObservableExt } from "../utils/observable/state/stateObservableExt";
import { createArticle, createDetails, createDiv, createLabel, createSwitch, createText } from "../utils/ui/elements";
import { MessagesStack } from "../utils/ui/message/messagesStack";

export function displayApp(
        lifeScope: LifeScope,
): Element {
    let container = createDiv()
    let messagesStack = new MessagesStack()
    container.appendChild(
        messagesStack.display(lifeScope)
    )
    container.appendChild(
        createText("App")
    )
    return container
}