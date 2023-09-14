import { loadable } from "./lib/loadable";
import { forable } from "./lib/forable";
import { actionable } from "./lib/actionable.ts";

interface Constructor<T> {
    new(...args: any[]): T;
}

const baseContext = new AudioContext({
    latencyHint: "interactive",
});

@actionable
@forable
@loadable
export class HelloWorldElement extends HTMLElement {
    buffer: AudioBuffer | undefined

    async load(response: Response): Promise<void> {
        const arrayBuffer = await response.arrayBuffer();
        console.log(arrayBuffer);
        this.buffer = await baseContext.decodeAudioData(arrayBuffer);
    }

    async forElementChangedCallback(element: Element): Promise<void> {
        console.log(element);
    }

    handleEvent() {
        const { buffer } = this;
        const sample = new AudioBufferSourceNode(baseContext, { buffer });

        sample.connect(baseContext.destination);
        sample.start();
    }
}

customElements.define("hello-world", HelloWorldElement);