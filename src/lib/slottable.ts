/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { camelCase } from "./strings";

interface Constructor<T> {
    new(...args: any[]): T;
}

interface SlottableElement extends HTMLElement {
}

export function createSlottable() {
    const metadata = new WeakMap<
        SlottableElement, Map<string | symbol, Element | null>
    >();


    const mainSlot = Symbol();

    function slottable<
        T extends Constructor<SlottableElement>
    >(ctr: T) {
        const query = Symbol();

        return class extends ctr {
            constructor(...args: any[]) {
                super(...args);
            }

            [query]() {
                if (!metadata.has(this)) {
                    metadata.set(this, new Map());
                }
                // continue...
                const elements = this.shadowRoot?.querySelectorAll<HTMLSlotElement>("slot") || [];
                for (const element of elements) {
                    const { name } = element;
                    // TODO -- validation
                    // using group as a boolean
                    metadata.get(this)?.set(camelCase(name) || mainSlot, element);
                }
            }

            connectedCallback() {
                this[query]();
                // @ts-ignore fix typing
                super.connectedCallback?.();
            }
        };
    }

    function slot(proto: object, name: PropertyKey) {
        Object.defineProperty(proto, name, {
            get() {
                // @ts-ignore type check this soon
                return metadata.get(this)?.get(name);
            }
        });
    }

    return { slottable, slot };
}