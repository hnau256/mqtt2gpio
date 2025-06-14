import { createDiv, createLabel, createText } from "../utils/ui/elements";

export class Input<T> {
    private input: HTMLInputElement;
    private decoder: (raw: string) => T;

    element: Element;

    constructor(
        title: string,
        id: string,
        type: string,
        initial: string,
        decoder: (raw: string) => T,
    ) {
        this.decoder = decoder;
        let input = document.createElement("input");
        this.input = input;
        input.setAttribute("id", id);
        input.setAttribute("type", type);
        input.setAttribute("value", initial);
        this.element = createDiv(
            [
                createLabel(
                    id,
                    [createText(title)]
                ),
                input,
            ]
        )
    }

    public get value(): T {
        let raw: string = this.input.value;
        return this.decoder(raw);
    }
}