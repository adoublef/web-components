/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

declare global {
    interface Actionable extends HTMLElement {
    }
}

interface Constructor<T> {
    new(...args: any[]): T;
}

export function actionable<
    T extends Constructor<Actionable>
>(ctr: T): T {
    return class extends ctr {
        constructor(...args: any[]) {
            super(...args);
        }

        __eventListeners(remove = false) {
            const elements = this.shadowRoot?.querySelectorAll<HTMLElement>("[data-action]");
            for (const element of (elements || [])) {
                const { dataset: { action } } = element;
                // TODO -- validation
                const [/* tagName, */ type, name = "handleEvent"] = (action as string).split(".");
                element[!remove ? "addEventListener" : "removeEventListener"](
                    type,
                    (this[name as keyof typeof this] as EventListener).bind(this)
                );
            }
        }


        static get observedAttributes(): string[] {
            // @ts-ignore observedAttributes may or may not exist
            return [...(ctr.observedAttributes || [])];
        }


        connectedCallback() {
            // @ts-ignore fix typing
            super.connectedCallback?.();

            this.__eventListeners();
        }

        disconnectedCallback() {
            // @ts-ignore fix typing
            super.disconnectedCallback?.();

            this.__eventListeners(true);
        }
    };
}