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
    const handleEventListeners = Symbol();


    return class extends ctr {
        constructor(...args: any[]) {
            super(...args);
        }

        [handleEventListeners](method: "addEventListener" | "removeEventListener" = "addEventListener") {
            const elements = (this.shadowRoot || this).querySelectorAll<HTMLElement>("[data-action]");
            for (const element of (elements || [])) {
                const { dataset: { action } } = element;
                // TODO -- validation
                const [type, name = "handle-event"] = (action as string).split(".");
                element[method](type,
                    (this[camelCase(name) as keyof typeof this] as EventListener).bind(this));
            }
        }

        connectedCallback() {
            this[handleEventListeners]();
            // @ts-ignore fix typing
            super.connectedCallback?.();
        }

        disconnectedCallback() {
            this[handleEventListeners]("removeEventListener");
            // @ts-ignore fix typing
            super.disconnectedCallback?.();
        }
    };
}