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
        TargetableElement, Map<string | symbol, Element | Element[] | null>
    >();

    function targetable<
        T extends Constructor<TargetableElement>
    >(ctr: T): T {
        const querySelectorAll = Symbol();
        // @targetable <- class
        // @target <- props
        return class extends ctr {
            constructor(...args: any[]) {
                super(...args);
            }

            [querySelectorAll]() {
                if (!metadata.has(this)) {
                    metadata.set(this, new Map());
                }
                // NOTE -- matches [data-target] & [data-target=key]
                const elements = this.shadowRoot?.querySelectorAll<HTMLElement>("[data-target]") || [];
                for (const element of elements) {
                    const { dataset: { target, group } } = element;
                    const elementName = target || camelCase(element.localName)
                    // TODO -- validation
                    // using group as a boolean
                    metadata.get(this)?.set(elementName, element);
                }
            }

            connectedCallback() {
                this[querySelectorAll]();
                // @ts-ignore fix typing
                super.connectedCallback?.();
            }
        };
    }

    function target<
        T extends TargetableElement
    >(proto: T, name: keyof T) {
        Object.defineProperty(proto, name, {
            get() {
                // @ts-ignore type check this soon
                return metadata.get(this)?.get(name);
            }
        });
    }

    return { targetable, target };
}