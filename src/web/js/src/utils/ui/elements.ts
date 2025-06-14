import { LifeScope } from "../lifeScope";
import { Observable } from "../observable/observable";
import { StateObservable } from "../observable/state/stateObservable";

export function createElement(
        name: string
): Element {
    return document.createElement(name)
}

export function setIsLoading(
        element: Element,
        isLoading: boolean,
) {
    element.setAttribute(
        "aria-busy",
        isLoading
            ? "true"
            : "false"
    )
}

export function setLoading(
        lifeScope: LifeScope,
        element: Element,
        loading: StateObservable<boolean>,
) {
    loading.observe(
        lifeScope,
        (isLoading) => {
            setIsLoading( element, isLoading)
        }
    )
}

export function createDetails(
        summary: string,
        isOpened?: boolean,
        content?: Node[],
): Element {
    let result = createElement("details")
    if (isOpened ?? false) {
        result.toggleAttribute("open", true)
    }
    let summaryElement = createElement("summary")
    summaryElement.textContent = summary
    result.appendChild(summaryElement)
    result.append(...(content ?? []))
    return result
}

export function createLabel(
        forId: string,
        children?: Node[],
): Element {
    let result = createElement("label")
    result.setAttribute("for", forId)
    result.append(...(children ?? []))
    return result
}

export function createSwitch(
        lifeScope: LifeScope,
        state: StateObservable<boolean>,
        onStateChanged: (isChecked: boolean) => void,
        id?: string,
): Element {
    let result = createElement("input") as HTMLInputElement
    result.setAttribute("type", "checkbox")
    result.setAttribute("role", "switch")
    if (id) {
        result.setAttribute("id", id)
    }
    if (state.value) {
        result.toggleAttribute("checked", true)
    }
    result.onchange = () => { onStateChanged(result.checked) }
    state.observe(
        lifeScope,
        (newState) => { result.checked = newState }
    )
    return result
}

export function createHeader(
        level: Number,
        text: string,
): Element {
    let result = createElement(`h${level}`);
    result.textContent = text;
    return result
}

export function createDiv(
        children?: Node[],
): Element {
    let result = createElement("div")
    children?.forEach((child) => {
        result.appendChild(child)
    })
    return result
}

export function createGroup(
        children?: Node[],
): Element {
    let result = createElement("fieldset")
    result.role = "group"
    children?.forEach((child) => {
        result.appendChild(child)
    })
    return result
}

export function createArticle(
        children?: Node[]
): Element {
    let result = createElement("article");
    result.append(...(children ?? []))
    return result;
}

export function createText(
        text: string,
): Node {
    return document.createTextNode(text);
}

export function createParagraph(
        text: string,
): Element {
    let result = createElement("p");
    result.textContent = text;
    return result
}

export enum ButtonLevel { Primary, Secondary, Contrast }

export function createButton(
        text: string,
        onClick: () => void,
        level?: ButtonLevel,
        outline?: boolean,
): Element {
    let result = createElement("button") as HTMLButtonElement;
    switch (level ?? ButtonLevel.Primary) {
        case ButtonLevel.Secondary:
            result.classList.add("secondary");
            break;
        case ButtonLevel.Contrast:
            result.classList.add("contrast");
            break;
    }
    if (outline ?? false) {
        result.classList.add("outline");
    }
    result.textContent = text;
    result.onclick = onClick;
    return result;
}