/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

interface Constructor<T> {
    new(...args: any[]): T;
}

declare global {
    type FetchPriority = "low" | "high" | "auto";
    type LoadingBehavior = "eager" | "lazy" | "auto";

    interface RequestInit {
        /**
         * [can-i-use](https://caniuse.com/?search=fetchpriority)
         */
        priority?: FetchPriority;
    }

    interface Loadable extends HTMLElement {
        src?: string;
        loading?: LoadingBehavior;
        fetchpriority?: FetchPriority;
        load(response: Response): Promise<void>;
    }
}


export function loadable<
    T extends Constructor<Loadable>
>(ctr: T): T {
    return class extends ctr {
        constructor(...args: any[]) {
            super(...args);
        }

        async __load(src: string) {
            // cannot use this dispatch loadstart
            this.dispatchEvent(new Event("loadstart"));
            try {
                // get `fetchPriority` to work
                const res = await fetch(src, {
                    priority: this.fetchpriority || "auto",
                    method: "get"
                });
                await this.load(res);
                this.dispatchEvent(new Event("load"));
            } catch (error) {
                this.dispatchEvent(new Event("error"));
            } finally {
                this.dispatchEvent(new Event("loadend"));
            }
        }

        static get observedAttributes(): string[] {
            // @ts-ignore observedAttributes may or may not exist
            return ["src", "loading", "fetchpriority", ...(ctr.observedAttributes || [])];
        }

        attributeChangedCallback(name: string, currentValue?: string, value?: string) {
            // @ts-ignore will need to type-check this
            super.attributeChangedCallback?.(name, currentValue, value);

            if (name === "src" && value) {
                this.__load(value);
            }
        }
    };
}