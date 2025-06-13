import { Cycle } from "../../../../cycle/cycle";
import { Repository } from "../../../../repository/repository";
import { displayCycleChart } from "../../../../utils/displayCycleChart";
import { InProgressRegistry } from "../../../../utils/inProgressRegistry";
import { LifeScope } from "../../../../utils/lifeScope";
import { Optional } from "../../../../utils/optional";
import { PromiseExt } from "../../../../utils/promiseExt";
import { createArticle, createButton, createDiv, createText, setLoading } from "../../utils/elements";
import { MessageDisplayer } from "../../utils/message/messagesDisplayer";

export function displayCycle(
    args: {
        lifeScope: LifeScope,
        repository: Repository,
        messagesDisplayer: MessageDisplayer,
        cycleToEditOrNone: Optional<{ name: CycleName, cycle: Cycle }>,
        returnToList: () => void,
    }
): Element {
    let result = createDiv({
        children: [
            displayTopPanel({
                lifeScope: args.lifeScope,
                repository: args.repository,
                name: args.cycleToEditOrNone.map({ transform: (cycleToEditOrNone) => cycleToEditOrNone.name }),
                returnToList: args.returnToList,
                messagesDisplayer: args.messagesDisplayer,
            }),
            displayCycleChart({
                lifeScope: args.lifeScope,
                cycle: args.cycleToEditOrNone.fold({
                    ifNone: () => new Cycle({ items: [] }),
                    ifSome: (cycleToEdit) => cycleToEdit.cycle,
                })
            })
        ]
    })
    return result
}

function displayTopPanel(
    args: {
        lifeScope: LifeScope,
        repository: Repository,
        messagesDisplayer: MessageDisplayer,
        name: Optional<CycleName>,
        returnToList: () => void,
    }
): Element {
    let buttons: Node[] = [
        createButton({
            text: "Cancel",
            onClick: args.returnToList,
        }),
        createText({
            text: " "
        }),
    ]
    args.name.map({
        transform: (name) => {
            let removeButton = displayRemoveButton({
                lifeScope: args.lifeScope,
                repository: args.repository,
                messagesDisplayer: args.messagesDisplayer,
                name: name,
                returnToList: args.returnToList
            })
            buttons.push(removeButton)
        }
    })
    return createArticle({
        children: buttons
    })
}

function displayRemoveButton(
    args: {
        lifeScope: LifeScope,
        repository: Repository,
        messagesDisplayer: MessageDisplayer,
        name: CycleName,
        returnToList: () => void,
    }
): Element {
    let isRemoving = new InProgressRegistry({
        lifeScope: args.lifeScope,
    })
    let button = createButton({
        text: "Remove",
        onClick: () => {
            let removePromise = args.repository.removeCycle({
                name: args.name,
            })
            isRemoving.register({ promise: removePromise })
            PromiseExt.awaitPromise({
                lifeScope: args.lifeScope,
                promise: removePromise,
                callback: (removedOrNone: Optional<void>) => {
                    removedOrNone.fold({
                        ifNone: () => {
                            args.messagesDisplayer.displayMessage({
                                message: `Unable remove cycle ${name}`
                            })
                        },
                        ifSome: (_) => {
                            args.returnToList()
                        }
                    })
                }
            })
        },
    })
    setLoading({
        lifeScope: args.lifeScope,
        element: button,
        loading: isRemoving.inProgress,
    })
    return button
}