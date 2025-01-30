class QuantumIcon extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        const template = this.#getTemplate();
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.cssFiles = new Map(); // Asegúrate de inicializar cssFiles aquí
    }

    #getTemplate(){
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

    async getCssFile(fileName) {
        if(!this.cssFiles.has(fileName)){
            let css = await fetch(fileName).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch CSS: ${response.statusText}`);
                }
                return response.text();
            });
            if(!this.cssFiles.has(fileName)) {
                this.cssFiles.set(fileName, css);
            }
            return css;
        } else {
            return this.cssFiles.get(fileName);
        }
    }

    async applyStyles(cssFileName) {
        try {
            const cssText = await this.getCssFile(cssFileName);
            const styleElement = document.createElement('style');
            styleElement.textContent = cssText;
            this.shadowRoot.appendChild(styleElement);
            this.styleLoaded = true;
        } catch (error) {
            console.error('Error loading CSS file:', error);
        }
    }

    async getSVG(iconName) {
        const svgFile = `${iconName}.svg`;
        const response = await fetch(svgFile);
        if (!response.ok) {
            throw new Error(`Failed to fetch SVG: ${response.statusText}`);
        }
        return await response.text();
    }

    async connectedCallback() {
        console.log("ConnectedCallback!");
        
      //  await this.applyStyles('QuantumIconTest.css'); // Cargar el CSS

        const iconName = this.getAttribute('icon-name');
        const svgElement = this.shadowRoot.querySelector('.QuantumIcon');
        
        const svgContent = await this.getSVG(iconName);
        svgElement.innerHTML = svgContent;
    }
}

window.customElements.define('quantum-icon', QuantumIcon);