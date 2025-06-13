import { Cycle } from "../../../../../cycle/cycle";
import { Repository } from "../../../../../repository/repository";
import { InProgressRegistry } from "../../../../../utils/inProgressRegistry";
import { LifeScope } from "../../../../../utils/lifeScope";
import { PromiseExt } from "../../../../../utils/promiseExt";
import { ButtonLevel, createArticle, createButton, createDiv, createHeader, createText, setLoading } from "../../../utils/elements"
import { MessageDisplayer } from "../../../utils/message/messagesDisplayer";

export function displayCyclesList(
    args: {
        lifeScope: LifeScope,
        repository: Repository,
        cycles: CycleName[],
        messagesDisplayer: MessageDisplayer,
        createNewCycle: () => void,
        editCycle: (value: { name: CycleName, cycle: Cycle }) => void,
    }
): Element {
    let result = createDiv({});
    args.cycles.forEach((cycle) => {
        result.appendChild(
            displayCycle({
                lifeScope: args.lifeScope,
                repository: args.repository,
                name: cycle,
                messagesDisplayer: args.messagesDisplayer,
                editCycle: args.editCycle,
            })
        )
    })
    result.appendChild(
        createButton({
            text: "Create new cycle",
            onClick: args.createNewCycle,
        })
    )
    return result;
}

function displayCycle(
    args: {
        lifeScope: LifeScope,
        repository: Repository,
        name: CycleName,
        messagesDisplayer: MessageDisplayer,
        editCycle: (value: { name: CycleName, cycle: Cycle }) => void,
    }
) {
    let isLoadingCycle = new InProgressRegistry({
        lifeScope: args.lifeScope,
    })
    let editButton = createButton({
        text: "Edit",
        onClick: () => {
            let cycleOrNonePromise = args.repository.getCycle({
                name: args.name,
            })
            isLoadingCycle.register({
                promise: cycleOrNonePromise,
            })
            PromiseExt.awaitPromise({
                lifeScope: args.lifeScope,
                promise: cycleOrNonePromise,
                callback: (cycleOrNone) => {
                    cycleOrNone.fold({
                        ifNone: () => {
                            args.messagesDisplayer.displayMessage({
                                message: `Unable load cycle ${args.name}`
                            })
                        },
                        ifSome: (cycle) => {
                            args.editCycle({
                                name: args.name,
                                cycle: cycle,
                            })
                        }
                    })
                }
            })
        },
        level: ButtonLevel.Secondary,
        outline: true,
    })
    setLoading({
        element: editButton,
        lifeScope: args.lifeScope,
        loading: isLoadingCycle.inProgress,
    })
    let result = createArticle({
        children: [
            createHeader({
                level: 3,
                text: args.name
            }),
            createButton({
                text: "Launch",
                onClick: () => { },
            }),
            createText({
                text: " "
            }),
            editButton,
        ]
    });
    return result;
}