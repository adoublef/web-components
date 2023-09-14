/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

/* 
https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md
*/

interface Constructor<T> {
    new(...args: any[]): T;
}

interface ProvidableElement extends HTMLElement {
}

export function createProvidable() {
    function providable<
        T extends Constructor<ProvidableElement>
    >(ctr: T): T {
        return class extends ctr { };
    }

    return { providable };
}