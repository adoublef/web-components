import { actionable, forable, loadable, createTargetable, createSlottable } from "./lib";
/* **** ACTIONABLE **************************************************** */
export class AAElement extends HTMLElement {
}
customElements.define("a-a", AAElement);
@actionable
export class ABElement extends HTMLElement {
    followUser() {
        alert("a-b");
    }
}
customElements.define("a-b", ABElement);
@actionable
export class ACElement extends HTMLElement {
    blockUser() {
        alert("a-c");
    }
}
customElements.define("a-c", ACElement);
/* **** TARGETABLE **************************************************** */
const { targetable, target, targetAll } = createTargetable();
@targetable
@actionable
export class BAElement extends HTMLElement {
    @targetAll
    declare bb: BBElement[];

    get isValid() {
        // Every user must be valid!
        return this.bb.every(b => b.isValid);
    }

    handleEvent() {
        alert(`This is ${!this.isValid ? "not valid" : "valid"}`);
    }
}
customElements.define("b-a", BAElement);
@targetable
export class BBElement extends HTMLElement {
    @target
    declare read: HTMLInputElement;

    @target
    declare write: HTMLInputElement;

    get isValid() {
        return this.read.checked || this.write.checked;
    }
}
customElements.define("b-b", BBElement);
/* **** SLOTTABLE ***************************************************** */
const { slottable, slot } = createSlottable();
@slottable
@targetable
class CAElement extends HTMLElement {
    @target
    declare span: HTMLSpanElement;

    @slot
    declare greeting: HTMLSlotElement;

    // try to get deconstruction working
    connectedCallback() {
        const { span, greeting } = this;
        span.textContent = `${greeting.assignedNodes().length}`;
    }
}
customElements.define("c-a", CAElement);
/* **** DEMO ********************************************************** */

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
        const { code } = this;
        code.textContent = `001`;
    }
}
customElements.define("effect-plugin", EffectPluginElement);

