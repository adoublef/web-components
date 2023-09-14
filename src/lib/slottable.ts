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
        const querySelectorAll = Symbol();

        return class extends ctr {
            constructor(...args: any[]) {
                super(...args);
            }

            [querySelectorAll]() {
                if (!metadata.has(this)) {
                    metadata.set(this, new Map());
                }
                // continue...
                const slots = (this.shadowRoot || this).querySelectorAll<HTMLSlotElement>("slot") || [];
                for (const slot of slots) {
                    // TODO -- validation
                    // using group as a boolean
                    const slotName = camelCase(slot.name) || mainSlot;
                    metadata.get(this)?.set(slotName, slot);
                }
            }

            connectedCallback() {
                this[querySelectorAll]();
                // @ts-ignore fix typing
                super.connectedCallback?.();
            }
        };
    }

    function slot<
        T extends SlottableElement
    >(proto: T, name: PropertyKey) {
        Object.defineProperty(proto, name, {
            get() {
                // @ts-ignore type check this soon
                return metadata.get(this)?.get(name);
            }
        });
    }

    return { slottable, slot };
}