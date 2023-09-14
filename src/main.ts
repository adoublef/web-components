import { actionable, forable, loadable, createTargetable, createProvidable, createSlottable } from "./lib";
/* **** ACTIONABLE **************************************************** */
export class AAElement extends HTMLElement {
}
customElements.define("a-a", AAElement);
@actionable
export class ABElement extends HTMLElement {
    followUser() {
        alert("a-b");
    }

    connectedCallback() {
    }
}
customElements.define("a-b", ABElement);
@actionable
export class ACElement extends HTMLElement {
    blockUser() {
        alert("a-c");
    }

    connectedCallback() {
    }
}
customElements.define("a-c", ACElement);
/* **** ACTIONABLE **************************************************** */
/* **** TARGETABLE **************************************************** */
const { targetable, target } = createTargetable();
export class BAElement extends HTMLElement {
    @target
    declare validators: BBElement[];
}
customElements.define("b-a", BAElement);
export class BBElement extends HTMLElement {
    @target
    declare read: HTMLInputElement;

    @target
    declare write: HTMLInputElement;

    get valid() {
        return this.read.checked || this.write.checked;
    }
}
customElements.define("b-b", BBElement);
/* **** TARGETABLE **************************************************** */
/* **** SLOTTABLE ***************************************************** */
const { slottable, slot } = createSlottable();
@slottable
@targetable
class CAElement extends HTMLElement {
    // @target({ many: true })
    @target
    declare span: HTMLSpanElement;

    @slot
    declare greeting: HTMLSlotElement;

    // try to get deconstruction working
    connectedCallback() {
        this.span.textContent = `${this.greeting.assignedNodes().length}`;
    }
}
customElements.define("c-a", CAElement);
/* **** SLOTTABLE ***************************************************** */
/* ******************************************************************** */
const baseContext = new AudioContext({ latencyHint: "interactive" });
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
@actionable
@targetable
export class EffectPluginElement extends HTMLElement {
    @target
    declare code: HTMLElement;

    // min

    // max

    // value

    handleEvent(evt: InputEvent) { }

    // try to get deconstruction working
    connectedCallback() {
        this.code.textContent = `001`;
    }
}
customElements.define("effect-plugin", EffectPluginElement);

