import { actionable, forable, loadable, createTargetable } from "./lib";

interface Constructor<T> {
    new(...args: any[]): T;
}

const baseContext = new AudioContext({
    latencyHint: "interactive",
});

@actionable
@forable
@loadable
export class AudioClipElement extends HTMLElement {
    buffer: AudioBuffer | undefined;

    async load(response: Response): Promise<void> {
        const arrayBuffer = await response.arrayBuffer();
        this.buffer = await baseContext.decodeAudioData(arrayBuffer);
    }

    async forElementChangedCallback(element: Element): Promise<void> {
        console.log(element);
    }

    handleEvent() {
        const { buffer } = this;
        const sample = new AudioBufferSourceNode(baseContext, { buffer });

        sample.connect(baseContext.destination);
        sample.start(baseContext.currentTime);
    }
}
customElements.define("audio-clip", AudioClipElement);

const { targetable, target } = createTargetable();

/* @actionable */
@targetable
export class EffectPluginElement extends HTMLElement {
    @target
    declare code: HTMLElement | null;

    connectedCallback() {
        this.code!.textContent = `001`;
    }
}
customElements.define("effect-plugin", EffectPluginElement);
