(function attachShadowRoots(root: Document | ShadowRoot) {
    root.querySelectorAll<HTMLTemplateElement>("template[shadowrootmode]").forEach(template => {
        const mode = (template.getAttribute("shadowrootmode") as ShadowRootMode | null) || "open";
        const shadowRoot = (template.parentNode as HTMLElement).attachShadow({ mode });
        shadowRoot.appendChild(template.content);
        template.remove();
        attachShadowRoots(shadowRoot);
    });
})(document);