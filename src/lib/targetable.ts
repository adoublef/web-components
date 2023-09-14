/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { camelCase } from "./strings";

interface Constructor<T> {
    new(...args: any[]): T;
}

declare global {
    interface Targetable extends HTMLElement {
    }
}
export function createTargetable() {
    const metadata = new WeakMap<
        Targetable, Map<string, Element | null>
    >();

    function targetable<
        T extends Constructor<Targetable>
    >(ctr: T): T {
        // @targetable <- class
        // @target <- props
        return class extends ctr {
            constructor(...args: any[]) {
                super(...args);
            }

            __queryElements() {
                if (!metadata.has(this)) {
                    metadata.set(this, new Map());
                }
                // NOTE -- matches [data-target] & [data-target=key]
                const elements = this.shadowRoot?.querySelectorAll<HTMLElement>("[data-target]");
                for (const element of (elements || [])) {
                    const { dataset: { target } } = element;
                    // TODO -- validation
                    metadata.get(this)?.set(target || camelCase(element.localName), element);
                }
            }

            connectedCallback() {
                this.__queryElements();
                // @ts-ignore fix typing
                super.connectedCallback?.();
            }
        };
    }

    function target(proto: object, name: PropertyKey) {
        Object.defineProperty(proto, name, {
            get() {
                // @ts-ignore type check this soon
                return metadata.get(this)?.get(name);
            }
        });
    }

    return { targetable, target };
}