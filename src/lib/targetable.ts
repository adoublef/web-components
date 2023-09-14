/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { camelCase } from "./strings";

interface Constructor<T> {
    new(...args: any[]): T;
}

interface TargetableElement extends HTMLElement {
}

export function createTargetable() {
    const metadata = new WeakMap<
        TargetableElement, Map<string, Element | Element[] | null>
    >();

    const query = Symbol();


    function targetable<
        T extends Constructor<TargetableElement>
    >(ctr: T): T {
        // @targetable <- class
        // @target <- props
        return class extends ctr {
            constructor(...args: any[]) {
                super(...args);
            }

            [query]() {
                if (!metadata.has(this)) {
                    metadata.set(this, new Map());
                }
                // NOTE -- matches [data-target] & [data-target=key]
                const elements = this.shadowRoot?.querySelectorAll<HTMLElement>("[data-target]") || [];
                for (const element of elements) {
                    const { dataset: { target, group } } = element;
                    // TODO -- validation
                    // using group as a boolean
                    metadata.get(this)?.set(target || camelCase(element.localName), element);
                }
            }

            connectedCallback() {
                this[query]();
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