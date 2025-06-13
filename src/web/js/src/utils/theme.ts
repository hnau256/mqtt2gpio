import { CallbackObservable } from "./observable/callbackOvservable";
import { SingleStateObservable } from "./observable/state/singleStateObservable";
import { StateObservable } from "./observable/state/stateObservable";
import { SimpleStateObservableImpl } from "./observable/state/simpleStateObservable";

export enum Theme { Light, Dark }

export function createThemeObservable(): StateObservable<Theme> {
    let matchMedia = window.matchMedia
    if (!matchMedia) {
        return new SingleStateObservable({ value: Theme.Light })
    }
    let query = matchMedia('(prefers-color-scheme: dark)')
    let resolveCurrentTheme: () => Theme = () => query.matches ? Theme.Dark : Theme.Light
    let updates = new CallbackObservable({
        observer: (lifescopeWithCallback) => {
            let listener: () => void = () => lifescopeWithCallback.callback(resolveCurrentTheme())
            query.addEventListener(changeEventListenerTypeName, listener)
            lifescopeWithCallback.lifeScope.onCancel({
                callback: () => query.removeEventListener(changeEventListenerTypeName, listener)
            })
        }
    })
    return new SimpleStateObservableImpl<Theme>({
        source: updates,
        initialValue: resolveCurrentTheme(),
    })
}

const changeEventListenerTypeName = "change"