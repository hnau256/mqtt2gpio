import { LifeScope } from "../../lifeScope";
import { MutableStateObservable } from "../../observable/state/mutable/mutableStateObservable";
import { MutableStateObservableExt } from "../../observable/state/mutable/mutableStateObservableExt";
import { MutableStateObservableImpl } from "../../observable/state/mutable/mutableStateObservableImpl";
import { ButtonLevel, createArticle, createButton, createDiv, createHeader } from "../elements";
import { MessageDisplayer } from "./messagesDisplayer";

export class MessagesStack implements MessageDisplayer {

    private currentIndex: number = 0

    private messages: MutableStateObservable<{ index: number, message: string }[]> =
        new MutableStateObservableImpl([])

    displayMessage(
            message: string,
    ): void {
        let index = this.currentIndex++;
        MutableStateObservableExt.update(
            this.messages,
            (messages: { index: number, message: string }[]) =>
                [...messages, { index: index, message: message }]
        )
        setTimeout(
            () => this.removeMessage(index),
            MessagesStack.messageDurationMilliseconds,
        )
    }

    private removeMessage(
            index: number,
    ) {
        MutableStateObservableExt.update(
             this.messages,
            (messages: { index: number, message: string }[]) =>
                messages.filter((indexWithMessage) => indexWithMessage.index !== index)
        )
    }

    display(
            lifeScope: LifeScope,
    ): Element {
        let children: Map<number, Element> = new Map()
        let result = createDiv()
        this.messages.observe(
            lifeScope,
            (messages) => {
                let childrenToRemove = new Set(children.keys())
                messages.forEach((indexWithMessage) => {
                    let index = indexWithMessage.index
                    if (!childrenToRemove.delete(index)) {
                        let messageElement = this.displayMessageElement(
                            indexWithMessage.message,
                            () => this.removeMessage(index)
                        )
                        result.append(messageElement)
                        children.set(index, messageElement)
                    }
                })
                childrenToRemove.forEach(
                    (childIndexToRemove) => {
                        result.removeChild(
                            children.get(childIndexToRemove)!!
                        )
                        children.delete(childIndexToRemove)
                    }
                )
            }
        )
        return result
    }

    private displayMessageElement(
            message: string,
            remove: () => void,
    ): Element {
        return createArticle(
            [
                createHeader(
                     4,
                    message,
                ),
                createButton(
                    "Close",
                    remove,
                    ButtonLevel.Secondary,
                    true,
                ),
            ]
        )
    }

    private static messageDurationMilliseconds = 3000
}