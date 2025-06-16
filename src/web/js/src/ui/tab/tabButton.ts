import { LifeScope } from "../../utils/lifeScope";
import { MutableStateObservable } from "../../utils/observable/state/mutable/mutableStateObservable";
import { StateObservable } from "../../utils/observable/state/stateObservable";
import { createButton}  from "../../utils/ui/elements";
import { Tab } from "./tab";

export function displayTabButton(
    lifeScope: LifeScope,
    title: string,
    tab: Tab,
    selectedTab: MutableStateObservable<Tab>,
): Element {
    let result = document.createElement("button") as HTMLButtonElement;
    selectedTab.observe(
        lifeScope,
        (selected) => {
            if (tab == selected) {
                result.classList.remove("outline");
            } else {
                result.classList.add("outline");
            }
        }
    )
    result.textContent = title;
    result.onclick = () => selectedTab.value = tab;
    return result;
}