import { LifeScope } from "../../../../utils/lifeScope";
import { MutableStateObservable } from "../../../../utils/observable/state/mutable/mutableStateObservable";
import { MutableStateObservableExt } from "../../../../utils/observable/state/mutable/mutableStateObservableExt";
import { MutableStateObservableImpl } from "../../../../utils/observable/state/mutable/mutableStateObservableImpl";
import { ButtonLevel, createArticle, createButton, createDiv, createHeader } from "../elements";
import { MessageDisplayer } from "./messagesDisplayer";

export class MessagesStack implements MessageDisplayer {

    private currentIndex: number = 0

    private messages: MutableStateObservable<{ index: number, message: string }[]> =
        new MutableStateObservableImpl({ initialValue: [] })

    displayMessage(
        args: {
            message: string;
        }
    ): void {
        let index = this.currentIndex++;
        MutableStateObservableExt.update({
            observable: this.messages,
            update: (messages: { index: number, message: string }[]) =>
                [...messages, { index: index, message: args.message }]
        })
        setTimeout(
            () => this.removeMessage({ index: index }),
            MessagesStack.messageDurationMilliseconds,
        )
    }

    private removeMessage(
        args: {
            index: number,
        }
    ) {
        MutableStateObservableExt.update({
            observable: this.messages,
            update: (messages: { index: number, message: string }[]) =>
                messages.filter((indexWithMessage) => indexWithMessage.index !== args.index)
        })
    }

    display(
        args: {
            lifeScope: LifeScope,
        }
    ): Element {
        let children: Map<number, Element> = new Map()
        let result = createDiv({})
        this.messages.observe({
            lifeScope: args.lifeScope,
            callback: (messages) => {
                let childrenToRemove = new Set(children.keys())
                messages.forEach((indexWithMessage) => {
                    let index = indexWithMessage.index
                    if (!childrenToRemove.delete(index)) {
                        let messageElement = this.displayMessageElement({
                            message: indexWithMessage.message,
                            remove: () => this.removeMessage({ index: index })
                        })
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
        })
        return result
    }

    private displayMessageElement(
        args: {
            message: string,
            remove: () => void,
        }
    ): Element {
        return createArticle({
            children: [
                createHeader({
                    level: 4,
                    text: args.message,
                }),
                createButton({
                    text: "Close",
                    onClick: args.remove,
                    level: ButtonLevel.Secondary,
                    outline: true,
                }),
            ]
        })
    }

    private static messageDurationMilliseconds = 3000
}