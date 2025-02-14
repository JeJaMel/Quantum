import { Quantum } from './Quantum.js';

export const QuantumStatusBar = class extends Quantum {

    constructor(props) {
        super(props);
        this.attachShadow({ mode: 'open' });
        this.template = this.#getTemplate();
        this.statusBar = document.importNode(this.template.content, true);
        this.styleLoaded = false;
    }

    async applyStyles(cssFileName) {
        try {
            const cssText = await this.getCssFile(cssFileName);
            if (!cssText) {
                throw new Error(`Failed to load CSS: ${cssFileName}`);
            }

            const styleElement = document.createElement('style');
            styleElement.textContent = cssText + `
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            this.shadowRoot.appendChild(styleElement);
            this.styleLoaded = true;
            this.shadowRoot.appendChild(this.statusBar);
            this.updateAttributes();

        } catch (error) {
            console.error('Error applying CSS file:', error);
        }
    }


    #getTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
    <div class="error">
        <div class="error__Icon">
            <img alt="Error">
        </div>
        <div class="error__body">
            <p><strong class="error__title">Error</strong></p>
            <p>We have problems to communicate with services</p>
        </div>
        <button class="error__action">Try again</button>
        <button class="error__close" style="display: none;">&times;</button>
    </div>`;
        return template;
    }


    connectedCallback() {
        console.log('connectedCallback called');
        this.applyStyles('QuantumStatusBar');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.styleLoaded) {
            switch (name) {
                case 'type':
                    this.updateType();
                    break;
                case 'message':
                    this.updateMessage();
                    break;
                case 'icon':
                    this.updateIcon();
                    break;
                case 'action-text':
                    this.updateActionText();
                    break;
                case 'action-url':
                    this.updateActionUrl();
                    break;
                case 'dismissible':
                    this.updateDismissible();
                    break;
                case 'fadeout':
                    this.updateFadeOut();
                    break;

            }
        }
    }

    static get observedAttributes() {
        return ['type', 'message', 'icon', 'action-text', 'action-url', 'dismissible', 'fadeout'];
    }

    updateType() {
        const type = this.getAttribute('type');
        const titleElement = this.shadowRoot.querySelector('.error__title');
        const bodyElement = this.shadowRoot.querySelector('.error__body p:nth-child(2)');

        if (titleElement && bodyElement) {
            switch (type) {
                case 'network':
                    titleElement.textContent = 'Network Error';
                    bodyElement.textContent = 'There was a problem connecting to the network.';
                    break;
                case 'server':
                    titleElement.textContent = 'Server Error';
                    bodyElement.textContent = 'The server encountered an error.';
                    break;
                case 'validation':
                    titleElement.textContent = 'Validation Error';
                    bodyElement.textContent = 'There was a validation error with your input.';
                    break;
                default:
                    titleElement.textContent = 'Error';
                    bodyElement.textContent = 'We have problems to communicate with services';
                    break;
            }
        }
    }

    updateMessage() {
        const message = this.getAttribute('message');
        const bodyElement = this.shadowRoot.querySelector('.error__body p:nth-child(2)');
        if (bodyElement && message) {
            bodyElement.textContent = message;
        }
    }

    async updateIcon() {
        const iconName = this.getAttribute('icon');
        const iconElement = this.shadowRoot.querySelector('.error__Icon img');
        if (iconElement && iconName) {
            try {
                const svgText = await this.getSVG(iconName);
                if (svgText) {
                    iconElement.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
                } else {
                    console.error("SVG not found:", iconName);
                }
            } catch (error) {
                console.error("Error loading SVG:", error);
            }
        }
    }

    updateActionText() {
        const actionText = this.getAttribute('action-text');
        const actionButton = this.shadowRoot.querySelector('.error__action');
        if (actionButton && actionText) {
            actionButton.textContent = actionText;
        }
    }

    updateActionUrl() {
        const actionUrl = this.getAttribute('action-url');
        const actionButton = this.shadowRoot.querySelector('.error__action');
        if (actionButton && actionUrl) {
            actionButton.onclick = () => {
                window.location.href = actionUrl;
            };
        }
    }

    updateDismissible() {
        const dismissible = this.getAttribute('dismissible');
        const closeButton = this.shadowRoot.querySelector('.error__close');
        if (closeButton) {
            if (dismissible === 'true') {
                closeButton.style.display = 'block';
                closeButton.addEventListener('click', () => {
                    this.remove();
                });
            } else {
                closeButton.style.display = 'none';
            }
        }
    }

    updateFadeOut() {
        const fadeOutTime = parseInt(this.getAttribute('fadeout'), 10);
        if (!isNaN(fadeOutTime) && fadeOutTime > 0) {
            setTimeout(() => {
                this.shadowRoot.querySelector('.error').style.animation = `fadeOut 1s ease-out`;
                setTimeout(() => this.remove(), 1000);
            }, fadeOutTime * 1000);
        }
    }

    updateAttributes() {
        this.updateType();
        this.updateMessage();
        this.updateIcon();
        this.updateActionText();
        this.updateActionUrl();
        this.updateDismissible();
        this.updateFadeOut();
    }

}

window.customElements.define('quantum-statusbar', QuantumStatusBar);