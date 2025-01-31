class QuantumIcon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = this.#getTemplate();
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.cssFiles = new Map();
        this.styleLoaded = false;
    }

    #getTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
        <div class="QuantumIconContainer">
            <div class="QuantumContainerSVG">
                <svg class="QuantumIcon"></svg>
            </div>
            <div class="QuantumIconCaption"></div>
            <div class="QuantumIconHint"></div>
        </div>                
        `;
        return template;
    }

    static get observedAttributes() {
        return ['icon-name', 'caption', 'hint', 'active-shadow', 'on-press'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.styleLoaded) {
            switch (name) {
                case 'icon-name':
                    this.updateIcon();
                    break;
                case 'caption':
                    this.updateCaption();
                    break;
                case 'hint':
                    this.updateHint();
                    break;
                case 'active-shadow':
                    this.updateActiveShadow();
                    break;
                case 'on-press':
                    this.updateOnPress();
                    break;
            }
        }
    }

    async getCssFile(fileName) {
        if (!this.cssFiles.has(fileName)) {
            try {
                let css = await fetch(fileName).then(response => {
                    if (!response.ok) throw new Error(`Failed to fetch CSS: ${response.statusText}`);
                    return response.text();
                });
                this.cssFiles.set(fileName, css);
            } catch (error) {
                console.error('Error loading CSS file:', error);
                return null;
            }
        }
        return this.cssFiles.get(fileName);
    }

    async applyStyles(cssFileName) {
        const cssText = await this.getCssFile(cssFileName);
        if (cssText) {
            const styleElement = document.createElement('style');
            styleElement.textContent = cssText;
            this.shadowRoot.appendChild(styleElement);
            this.styleLoaded = true;
            this.updateAttributes();
        }
    }

    async getSVG(iconName) {
        if (!iconName) return '';
        try {
            const response = await fetch(`${iconName}.svg`);
            if (!response.ok) throw new Error(`Failed to fetch SVG: ${response.statusText}`);
            const svgText = await response.text();
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = svgText;
            const svgElement = tempDiv.querySelector("svg");

            if (svgElement) {
                if (!svgElement.hasAttribute("viewBox")) {
                    let width = svgElement.getAttribute("width") || "24";
                    let height = svgElement.getAttribute("height") || "24";
                    svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
                }
                svgElement.setAttribute("width", "100%");
                svgElement.setAttribute("height", "100%");
            }
            return tempDiv.innerHTML;
        } catch (error) {
            console.error('Error loading SVG:', error);
            return '';
        }
    }

    async connectedCallback() {
        console.log("QuantumIcon connected!");
        this.style.visibility = 'hidden'; // Hide while loading

        await this.applyStyles('QuantumIconTest.css'); // Load css

        this.updateAttributes();
        this.style.visibility = 'visible'; //Show after loading

        const container = this.shadowRoot.querySelector('.QuantumIconContainer');
        const hintElement = this.shadowRoot.querySelector('.QuantumIconHint');

        container.addEventListener('mouseenter', () => {
            if (this.getAttribute('hint')) hintElement.style.visibility = 'visible';
        });
        container.addEventListener('mouseleave', () => {
            hintElement.style.visibility = 'hidden';
        });

        container.addEventListener('click', () => {
            this.executeOnPress();
        });
    }

    updateAttributes() {
        this.updateIcon();
        this.updateCaption();
        this.updateHint();
        this.updateActiveShadow();
        this.updateOnPress();
    }

    async updateIcon() {
        const iconName = this.getAttribute('icon-name');
        const svgElement = this.shadowRoot.querySelector('.QuantumIcon');
        svgElement.innerHTML = await this.getSVG(iconName);
    }

    updateCaption() {
        const caption = this.getAttribute('caption') || '';
        this.shadowRoot.querySelector('.QuantumIconCaption').textContent = caption;
    }

    updateHint() {
        const hint = this.getAttribute('hint') || '';
        const hintElement = this.shadowRoot.querySelector('.QuantumIconHint');
        hintElement.textContent = hint;
        hintElement.style.visibility = hint ? 'hidden' : 'hidden';
    }

    updateActiveShadow() {
        const container = this.shadowRoot.querySelector('.QuantumIconContainer');
        if (this.hasAttribute('active-shadow')) {
            container.classList.add('active-shadow');
        } else {
            container.classList.remove('active-shadow');
        }
    }

    updateOnPress() {
        // This method can be used to update any state if needed
    }

    executeOnPress() {
        const onPress = this.getAttribute('on-press');
        if (onPress) {
            const func = window[onPress];
            if (typeof func === 'function') {
                func.call(this);
            } else {
                console.warn(`Function ${onPress} is not defined`);
            }
        }
    }
}

window.customElements.define('quantum-icon', QuantumIcon);