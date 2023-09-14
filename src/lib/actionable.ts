/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { camelCase } from "./strings";

interface Constructor<T> {
    new(...args: any[]): T;
}

interface ActionableElement extends HTMLElement {
}

export function actionable<
    T extends Constructor<ActionableElement>
>(ctr: T): T {
    return class extends ctr {
        constructor(...args: any[]) {
            super(...args);
        }

        __eventListeners(method: "addEventListener" | "removeEventListener" = "addEventListener") {
            const elements = (this.shadowRoot || this).querySelectorAll<HTMLElement>("[data-action]");
            for (const element of (elements || [])) {
                const { dataset: { action } } = element;
                // TODO -- validation
                const [/* tagName, */ type, name = "handle-event"] = (action as string).split(".");
                element[method](type,
                    (this[camelCase(name) as keyof typeof this] as EventListener).bind(this));
            }
        }

        connectedCallback() {
            this.__eventListeners();
            // @ts-ignore fix typing
            super.connectedCallback?.();
        }

        disconnectedCallback() {
            this.__eventListeners("removeEventListener");
            // @ts-ignore fix typing
            super.disconnectedCallback?.();
        }
    };
}