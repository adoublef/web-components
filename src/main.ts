import { loadable } from "./lib/loadable";
import { forable } from "./lib/forable";
import { actionable } from "./lib/actionable.ts";

interface Constructor<T> {
    new(...args: any[]): T;
}

@actionable
@forable
@loadable
export class HelloWorldElement extends HTMLElement {
    async load(response: Response): Promise<void> {
        console.log(response);
    }

    async forElementChangedCallback(element: Element): Promise<void> {
        console.log(element);
    }

    greet() {
        alert("greet");
    }

    handleEvent() {
        alert("generic");
    }
}

customElements.define("hello-world", HelloWorldElement);