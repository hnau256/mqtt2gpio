import { CallbackObservable } from "./observable/callbackOvservable";
import { SingleStateObservable } from "./observable/state/singleStateObservable";
import { StateObservable } from "./observable/state/stateObservable";
import { SimpleStateObservableImpl } from "./observable/state/simpleStateObservable";

export enum Theme { Light, Dark }

export function createThemeObservable(): StateObservable<Theme> {
    let matchMedia = window.matchMedia
    if (!matchMedia) {
        return new SingleStateObservable(Theme.Light)
    }
    let query = matchMedia('(prefers-color-scheme: dark)')
    let resolveCurrentTheme: () => Theme = () => query.matches ? Theme.Dark : Theme.Light
    let updates = new CallbackObservable<Theme>(
         (lifescope, callback) => {
            let listener: () => void = () => callback(resolveCurrentTheme())
            query.addEventListener(changeEventListenerTypeName, listener)
            lifescope.onCancel(
                () => query.removeEventListener(changeEventListenerTypeName, listener)
            )
        }
    )
    return new SimpleStateObservableImpl<Theme>(
        resolveCurrentTheme(),
        updates,
    )
}

const changeEventListenerTypeName = "change"