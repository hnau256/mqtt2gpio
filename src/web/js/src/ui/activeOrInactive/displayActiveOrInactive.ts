import { LifeScope } from "../../utils/lifeScope"
import { Repository } from "../../repository/repository"
import { displayInactive } from "./inactive/displayInactive"
import { MessageDisplayer } from "./utils/message/messagesDisplayer"

export function displayActiveOrInactive(
    args: {
        lifeScope: LifeScope,
        repository: Repository,
        messagesDisplayer: MessageDisplayer,
    }
): Element {
    return displayInactive({
        lifeScope: args.lifeScope,
        repository: args.repository,
        messagesDisplayer: args.messagesDisplayer,
        switchToActive: () => { },
    })
}