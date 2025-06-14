import { None, Optional, Some } from "../utils/optional";
import { Binding, BindingDirection, BindingType, Settings } from "./settings";
import { isDebug } from "../utils/is_debug";

export class Repository {

    async getSettings(): Promise<Optional<Settings>> {
        if (isDebug) {
            return new Some(createSettingsStub())
        }
        return this.doRequest(
            "/get_settings",
            "GET",
            (response) => JSON.parse(response),
        )
    }

    async setSettingsAndRestart(
        settings: Settings,
    ): Promise<Optional<void>> {
        if (isDebug) {
            console.log(`Sending "${JSON.stringify(settings)}"`)
            await delay(3000)
            return new Some(undefined)
        }
        let resultOrNone = await this.doRequest(
            "/set_settings_and_restart",
            "POST",
            async (_) => undefined,
            JSON.stringify(settings),
        );
        if (resultOrNone instanceof Some) {
            await delay(3000);
        }
        return resultOrNone;
    }

    private async doRequest<R>(
        path: string,
        method: string,
        transformReponse: (response: string) => Promise<R>,
        body?: BodyInit,
    ): Promise<Optional<R>> {
        try {
            if (body) {
            console.log(`Sending "${JSON.stringify(body)}" to ${path}`)
            }
            const response: Response = await fetch(
                path,
                {
                    body: body,
                    method: method,
                },
            );
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            let responseText = await response.text()
            console.log(`Received from ${path}: ${responseText}`)
            let result: R = await transformReponse(responseText)
            return new Some(result);
        } catch (error) {
            console.log(`Unable fetch ${path}: ${error}`)
            return None.instance;
        }
    }
}

function createSettingsStub(): Settings {
    return {
        mdns_name: "mqtt2gpio",
        mqtt: {
            address: "192.168.0.45",
            port: 1883,
            user: "user",
            password: "password"
        },
        bindings: [
            {
                type: BindingType.Bool,
                pin: 23,
                topic: "backyard/lamp",
                direction: BindingDirection.Subscribe,
            },
            {
                type: BindingType.Tic,
                pin: 8,
                topic: "backyard/button",
                direction: BindingDirection.Publish,
            },
            {
                type: BindingType.Float,
                pin: 3,
                topic: "backyard/light",
                direction: BindingDirection.Publish,
            }
        ]
    }
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}