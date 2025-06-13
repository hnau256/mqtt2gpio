import { LifeScope } from "../../../utils/lifeScope";
import { StateObservable } from "../../../utils/observable/state/stateObservable";
import { StateObservableExt } from "../../../utils/observable/state/stateObservableExt";
import { createDiv } from "./elements";

export function displayState<S>(
    args: {
        lifeScope: LifeScope,
        state: StateObservable<S>,
        display: (stateLifeScope: LifeScope, state: S) => Element,
    }
): Element {
    let result = createDiv({});
    let scoped = StateObservableExt.scoped({
        source: args.state,
        lifeScope: args.lifeScope
    })
    scoped.observe({
        lifeScope: args.lifeScope,
        callback: (stateLifeScopeWithState) => {
            let element = args.display(
                stateLifeScopeWithState.valueLifeScope,
                stateLifeScopeWithState.value,
            )
            let existingChild = result.firstChild;
            if (existingChild) {
                result.removeChild(existingChild);
            }
            result.appendChild(element);
        }
    })
    return result
}