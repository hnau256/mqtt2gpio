import { LifeScope } from "../../../utils/lifeScope";
import { Observable } from "../../../utils/observable/observable";
import { StateObservable } from "../../../utils/observable/state/stateObservable";

export function createElement(
    args: {
        name: string
    }
): Element {
    return document.createElement(args.name)
}

export function setIsLoading(
    args: {
        element: Element,
        isLoading: boolean,
    }
) {
    args.element.setAttribute(
        "aria-busy",
        args.isLoading
            ? "true"
            : "false"
    )
}

export function setLoading(
    args: {
        element: Element,
        lifeScope: LifeScope,
        loading: StateObservable<boolean>,
    }
) {
    args.loading.observe({
        lifeScope: args.lifeScope,
        callback: (isLoading) => {
            setIsLoading({
                element: args.element,
                isLoading: isLoading,
            })
        }
    })
}

export function createDetails(
    args: {
        summary: string,
        isOpened?: boolean,
        content?: Node[]
    }
): Element {
    let result = createElement({
        name: "details"
    })
    if (args.isOpened ?? false) {
        result.toggleAttribute("open", true)
    }
    let summaryElement = createElement({
        name: "summary"
    })
    summaryElement.textContent = args.summary
    result.appendChild(summaryElement)
    result.append(...(args.content ?? []))
    return result
}

export function createLabel(
    args: {
        forId: string,
        children?: Node[]
    }
): Element {
    let result = createElement({
        name: "label"
    })
    result.setAttribute("for", args.forId)
    result.append(...(args.children ?? []))
    return result
}

export function createSwitch(
    args: {
        lifeScope: LifeScope,
        state: StateObservable<boolean>,
        onStateChanged: (isChecked: boolean) => void,
        id?: string,
    }
): Element {
    let result = createElement({
        name: "input"
    }) as HTMLInputElement
    result.setAttribute("type", "checkbox")
    result.setAttribute("role", "switch")
    if (args.id) {
        result.setAttribute("id", args.id)
    }
    if (args.state.value) {
        result.toggleAttribute("checked", true)
    }
    result.onchange = () => { args.onStateChanged(result.checked) }
    args.state.observe({
        lifeScope: args.lifeScope,
        callback: (newState) => { result.checked = newState }
    })
    return result
}

export function createHeader(
    args: {
        level: Number,
        text: string,
    }
): Element {
    let result = createElement({
        name: `h${args.level}`
    });
    result.textContent = args.text;
    return result
}

export function createDiv(
    args: {
        children?: Node[]
    }
): Element {
    let result = createElement({
        name: "div"
    })
    args.children?.forEach((child) => {
        result.appendChild(child)
    })
    return result
}

export function createArticle(
    args: {
        children?: Node[]
    }
): Element {
    let result = createElement({
        name: "article"
    });
    result.append(...(args.children ?? []))
    return result;
}

export function createText(
    args: {
        text: string
    }
): Node {
    return document.createTextNode(args.text);
}

export function createParagraph(
    args: {
        text: string
    }
): Element {
    let result = createElement({
        name: "p"
    });
    result.textContent = args.text;
    return result
}

export enum ButtonLevel { Primary, Secondary, Contrast }

export function createButton(
    args: {
        text: string,
        onClick: () => void,
        level?: ButtonLevel,
        outline?: boolean,
    }
): Element {
    let result = createElement({
        name: "button"
    }) as HTMLButtonElement;
    switch (args.level ?? ButtonLevel.Primary) {
        case ButtonLevel.Secondary:
            result.classList.add("secondary");
            break;
        case ButtonLevel.Contrast:
            result.classList.add("contrast");
            break;
    }
    if (args.outline ?? false) {
        result.classList.add("outline");
    }
    result.textContent = args.text;
    result.onclick = args.onClick;
    return result;
}