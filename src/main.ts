import { actionable, forable, loadable, createTargetable, createProvidable, createSlottable } from "./lib";
import { ContextEvent, createContext } from "./lib/context";

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
/* ******************************************************************** */
const { slottable, slot } = createSlottable();
@slottable
@targetable
class HelloWorldElement extends HTMLElement {
    @target
    declare span: HTMLSpanElement;

    @slot
    declare greeting: HTMLSlotElement;

    connectedCallback() {
        this.span.textContent = `${this.greeting.assignedNodes().length}`;
    }
}
customElements.define("hello-world", HelloWorldElement);
/* ******************************************************************** */
const { providable } = createProvidable();

const userIdContext = createContext("user-id", "123");
let provideAlready = false;

/* 
https://github.com/blikblum/wc-context/blob/master/core.js
https://github.com/blikblum/wc-context/blob/master/mixin.js
*/

@providable
export class UserRowElement extends HTMLElement {
    userId = "123";

    connectedCallback() {
        const ctx = new ContextEvent(userIdContext, (userId, unsubscribe) => {
            if (!provideAlready) {
                // this.my = userId;
            }
            unsubscribe?.();
        }, true);
        this.dispatchEvent(ctx);
    }
}
customElements.define("user-row", UserRowElement);
@providable
@actionable
export class FollowUserElement extends HTMLElement {
    followUser() {
        console.log("follow");
    }

    connectedCallback() {
    }
}
customElements.define("follow-user", FollowUserElement);
@providable
@actionable
export class BlockUserElement extends HTMLElement {
    blockUser() {
        console.log("block");
    }

    connectedCallback() {
    }
}
customElements.define("block-user", BlockUserElement);
