export const QuantumCheckBox = class extends Quantum {
    static observedAttributes = ["checked", "label"];

    constructor(props) {
        super();
        this.name = "QuantumCheckBox";
        this.props = props;
        this.built = () => {};
        this.attachShadow({ mode: 'open' });
    }

    #getTemplate() {
        return `
            <label class="QuantumCheckBox">
                <input type="checkbox" class="checkbox" />
                <span class="label"></span>
            </label>
        `;
    }

    async #getCss() {
        return await quantum.getCssFile("QuantumCheckBox");
    }

    async connectedCallback() {
        let sheet = new CSSStyleSheet();
        let css = await this.#getCss();
        sheet.replaceSync(css);
        this.shadowRoot.adoptedStyleSheets = [sheet];

        // Create the Component structure
        this.template = document.createElement('template');
        this.template.innerHTML = this.#getTemplate();
        let tpc = this.template.content.cloneNode(true);

        this.mainElement = tpc.querySelector(".QuantumCheckBox");
        this.checkbox = tpc.querySelector(".checkbox");
        this.labelElement = tpc.querySelector(".label");

        this.shadowRoot.appendChild(this.mainElement);

        for (let attr of this.getAttributeNames()) {
            this[attr] = this.getAttribute(attr);
        }

        if (this.props) {
            for (let prop in this.props) {
                switch (prop) {
                    case 'style':
                        for (let styleProp in this.props.style) {
                            this.mainElement.style[styleProp] = this.props.style[styleProp];
                        }
                        break;
                    case 'events':
                        for (let eventName in this.props.events) {
                            this.checkbox.addEventListener(eventName, this.props.events[eventName]);
                        }
                        break;
                    default:
                        this.setAttribute(prop, this.props[prop]);
                        this[prop] = this.props[prop];
                }
            }
        }

        this.built();
    }

    // Sincroniza cambios en los atributos observados
    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (attrName) {
            case "checked":
                this.checkbox.checked = newValue === "true";
                break;
            case "label":
                this.labelElement.textContent = newValue;
                break;
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

    addToBody() {
        document.body.appendChild(this);
    }
}

if (!customElements.get('quantum-checkbox')) {
    customElements.define('quantum-checkbox', QuantumCheckBox);
}
