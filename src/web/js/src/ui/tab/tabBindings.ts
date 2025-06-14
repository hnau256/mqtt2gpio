import { Binding, BindingDirection, BindingType, MqttSettings } from "../../data/settings";
import { CancellableLifeScope, LifeScope } from "../../utils/lifeScope";
import { createButton, createDiv } from "../../utils/ui/elements";
import { BindingView } from "../bindings/bindingView";
import { Input } from "../input";

export class TabBindings {

    private bindingsHolder: Element = createDiv()
    private nextBindingIndex: number = 0;
    private lifeScope: LifeScope;
    private bindingsMap: Map<string, BindingView> = new Map();

    element: Element = createDiv(
        [
            this.bindingsHolder,
        ]
    );

    constructor(
        lifeScope: LifeScope,
        initialBindings: Binding[],
    ) {
        this.lifeScope = lifeScope;
        this.element.appendChild(
            createButton(
                "Add binding",
                () => {
                    this.addBinding(
                        {
                            type: BindingType.Bool,
                            direction: BindingDirection.Subscribe,
                            pin: 8,
                            topic: "",
                        }
                    )
                },
            )
        )
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

    private addBinding(
        binding: Binding,
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
                this.bindingsHolder.removeChild(view.element)
            },
        )
        view.element.id = id
        this.bindingsMap.set(id, view)
        this.bindingsHolder.appendChild(view.element)
    }
}