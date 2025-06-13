import { LifeScope } from "../lifeScope";
import { StateObservable } from "../observable/state/stateObservable";
import { StateObservableExt } from "../observable/state/stateObservableExt";
import { createDiv } from "./elements";

export function displayState<S>(
        lifeScope: LifeScope,
        state: StateObservable<S>,
        display: (stateLifeScope: LifeScope, state: S) => Element,
): Element {
    let result = createDiv();
    let scoped = StateObservableExt.scoped(state, lifeScope)
    scoped.observe(
        lifeScope,
        (stateLifeScopeWithState) => {
            let element = display(
                stateLifeScopeWithState.valueLifeScope,
                stateLifeScopeWithState.value,
            )
            let existingChild = result.firstChild;
            if (existingChild) {
                result.removeChild(existingChild);
            }
            result.appendChild(element);
        }
    )
    return result
}