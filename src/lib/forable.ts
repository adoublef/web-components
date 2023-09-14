/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

interface Constructor<T> {
    new(...args: any[]): T;
}

declare global {
    interface Forable extends HTMLElement {
        htmlFor?: string;
        forElementChangedCallback(element: Element): Promise<void>;
    }
}

export function forable<
    T extends Constructor<Forable>
>(ctr: T): T {
    return class extends ctr {
        constructor(...args: any[]) {
            super(...args);
        }

        async __htmlFor(id: string) {
            const element = this.ownerDocument.getElementById(id);
            if (element) {
                // const observer = sync(this, element);
                try {
                    await super.forElementChangedCallback(element);
                } finally {
                    // observer.takeRecords();
                }
            }
        }

        static get observedAttributes(): string[] {
            // @ts-ignore observedAttributes may or may not exist
            return ["for", ...(ctr.observedAttributes || [])];
        }

        attributeChangedCallback(name: string, currentValue?: string, value?: string) {
            if (name === "for" && value) {
                this.__htmlFor(value);
            }
            // @ts-ignore will need to type-check this
            super.attributeChangedCallback?.(name, currentValue, value);
        }
    };
}