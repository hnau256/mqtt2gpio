export class SelectView<T> {

    element: HTMLSelectElement

    private variants: T[];

    constructor(
        variants: T[],
        selected: T,
        configElement: (option: HTMLOptionElement, value: T) => void,
    ) {
        this.variants = variants
        this.element = document.createElement("select")
        variants.forEach(
            (variant: T) => {
                let option = document.createElement("option")
                configElement(option, variant)
                this.element.appendChild(option)
            }
        )
        this.element.selectedIndex = variants.indexOf(selected)
    }

    get selected(): T {
        return this.variants[this.element.selectedIndex];
    }
}