import { Binding, BindingDirection, BindingType } from "../data/settings";
import { CancellableLifeScope, LifeScope } from "../utils/lifeScope";
import { createDiv } from "../utils/ui/elements";
import { BindingView } from "./bindingView";

export class BindingsView {

    element: Element = createDiv();

    private nextBindingIndex: number = 0;
    private lifeScope: LifeScope;
    private bindingsMap: Map<string, BindingView> = new Map();

    constructor(
        lifeScope: LifeScope,
        initialBindings: Binding[],
    ) {
        this.lifeScope = lifeScope;
        initialBindings.forEach(
            (binding: Binding) => {
                this.addBinding(binding)
            }
        )
    }

    get bindings(): Binding[] {
        return Array
            .from(this.bindingsMap.values())
            .map(view => view.binding)
    }

    addBinding(
        binding: Binding = {
            type: BindingType.Bool,
            direction: BindingDirection.Subscribe,
            pin: 8,
            topic: "",
        },
    ) {
        let id = "binding_" + (this.nextBindingIndex++)
        let bindingScope = CancellableLifeScope.create(this.lifeScope)
        var view: BindingView
        view = new BindingView(
            bindingScope,
            binding,
            () => {
                bindingScope.cancel()
                this.bindingsMap.delete(id)
                this.element.removeChild(view.element)
            },
        )
        view.element.id = id
        this.bindingsMap.set(id, view)
        this.element.appendChild(view.element)
    }
}