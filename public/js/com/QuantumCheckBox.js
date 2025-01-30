export const QuantumCheckBox = class extends Quantum {
    static observedAttributes = ["checked", "label", "group", "is-parent"];

    constructor(props) {
        super();
        this.name = "QuantumCheckBox";
        this.props = props || {};
        this.attachShadow({ mode: "open" });
        this.childrenCheckboxes = [];
    }

    #getTemplate() {
        return `
            <label class="QuantumCheckBox">
                <input type="checkbox" class="checkbox" />
                <span class="label"></span>
                <div class="group-container"></div>
            </label>
        `;
    }

    async #getCss() {
        return await this.getCssFile("QuantumCheckBox");
    }

    async connectedCallback() {
        console.log("QuantumCheckBox connectedCallback");
        let sheet = new CSSStyleSheet();
        let css = await this.#getCss();
        sheet.replaceSync(css);
        this.shadowRoot.adoptedStyleSheets = [sheet];

        this.template = document.createElement("template");
        this.template.innerHTML = this.#getTemplate();
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));

        this.mainElement = this.shadowRoot.querySelector(".QuantumCheckBox");
        this.checkbox = this.shadowRoot.querySelector(".checkbox");
        this.labelElement = this.shadowRoot.querySelector(".label");
        this.groupContainer = this.shadowRoot.querySelector(".group-container");

        this._updateAttributes();

        if (this.props) {
            this._setProps(this.props);
        }

        this.checkbox.addEventListener("change", this._onParentChange.bind(this));
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[attrName] = newValue;
        this._updateAttributes();
    }

    _updateAttributes() {
        this.checkbox.checked = this.hasAttribute("checked") && this.getAttribute("checked") === "true";
        this.labelElement.textContent = this.getAttribute("label") || "";
        if (this.hasAttribute("group")) {
            this._buildGroup(JSON.parse(this.getAttribute("group")));
        }
    }

    _setProps(props) {
        for (let prop in props) {
            switch (prop) {
                case "style":
                    Object.assign(this.mainElement.style, props.style);
                    break;
                case "events":
                    for (let eventName in props.events) {
                        this.checkbox.addEventListener(eventName, props.events[eventName]);
                    }
                    break;
                case "children":
                    this._buildGroup(props.children);
                    break;
                default:
                    this.setAttribute(prop, props[prop]);
            }
        }
    }

    _buildGroup(children) {
        this.groupContainer.innerHTML = "";
        this.childrenCheckboxes = children.map(childProps => {
            const child = document.createElement("quantum-checkbox");
            Object.assign(child, childProps);
            this.groupContainer.appendChild(child);
            return child;
        });
    }

    _onParentChange() {
        if (this.getAttribute("is-parent") === "true") {
            this.childrenCheckboxes.forEach(child => {
                child.checked = this.checkbox.checked;
            });
        }
    }

    get checked() {
        return this.checkbox.checked;
    }

    set checked(val) {
        this.setAttribute("checked", val);
        this.checkbox.checked = val;
    }

    get label() {
        return this.labelElement.textContent;
    }

    set label(val) {
        this.setAttribute("label", val);
        this.labelElement.textContent = val;
    }

    get group() {
        return this.childrenCheckboxes;
    }

    set group(children) {
        this._buildGroup(children);
    }
};

if (!customElements.get("quantum-checkbox")) {
    customElements.define("quantum-checkbox", QuantumCheckBox);
}
