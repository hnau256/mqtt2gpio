import { Repository } from "../repository/repository";
import { RepositoryType, RepositoryTypeSwitcher } from "../repository/switchRepository";
import { isDebug } from "../utils/is_debug";
import { LifeScope } from "../utils/lifeScope";
import { StateObservableExt } from "../utils/observable/state/stateObservableExt";
import { displayActiveOrInactive } from "./activeOrInactive/displayActiveOrInactive";
import { createArticle, createDetails, createDiv, createLabel, createSwitch, createText } from "./activeOrInactive/utils/elements";
import { MessagesStack } from "./activeOrInactive/utils/message/messagesStack";

export function displayApp(
    args: {
        lifeScope: LifeScope,
        repository: Repository,
        repositoryTypeSwitcher: RepositoryTypeSwitcher,
    }
): Element {
    let container = createDiv({})
    if (isDebug) {
        container.appendChild(
            displayDebug({
                lifeScope: args.lifeScope,
                repositoryTypeSwitcher: args.repositoryTypeSwitcher,
            })
        )
    }
    let messagesStack = new MessagesStack()
    container.appendChild(
        messagesStack.display({
            lifeScope: args.lifeScope,
        })
    )
    container.appendChild(
        displayActiveOrInactive({
            lifeScope: args.lifeScope,
            repository: args.repository,
            messagesDisplayer: messagesStack,
        })
    )
    return container
}

function displayDebug(
    args: {
        lifeScope: LifeScope,
        repositoryTypeSwitcher: RepositoryTypeSwitcher
    }
): Element {
    return createArticle({
        children: [
            displayUseMockRepository({
                lifeScope: args.lifeScope,
                repositoryTypeSwitcher: args.repositoryTypeSwitcher,
            })
        ]
    })
}

function displayUseMockRepository(
    args: {
        lifeScope: LifeScope,
        repositoryTypeSwitcher: RepositoryTypeSwitcher
    }
): Element {
    let switchId = "switch-mock-repository"
    let positiveType = RepositoryType.Mock
    let negativeType = RepositoryType.Fetch
    let input = createSwitch({
        lifeScope: args.lifeScope,
        state: StateObservableExt.map({
            source: args.repositoryTypeSwitcher.repositoryType,
            lifeScope: args.lifeScope,
            transform: (repositoryType) => { return repositoryType == positiveType }
        }),
        onStateChanged: (checked) => {
            args.repositoryTypeSwitcher.switchRepositoryType({
                type: checked
                    ? positiveType
                    : negativeType
            })
        },
        id: switchId
    })
    return createLabel({
        forId: switchId,
        children: [
            input,
            createText({
                text: "Use mock repository"
            })
        ]
    })
}