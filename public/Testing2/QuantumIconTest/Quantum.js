const QuantumTest = class extends HTMLElement {
    constructor(){
        super();
        this.cssFiles = new Map();
    }

    async getCssFile(fileName) {
        if(!this.cssFiles.has(fileName)){
            let css = await fetch(fileName).then((response) => response.text());
            if(!this.cssFiles.has(fileName)) {
                this.cssFiles.set(fileName, css);
            }
            console.log(css);
            return css;
        } else {
            return this.cssFiles.get(fileName);
        }
    }

    async getSVG(fileName) {
        if(!this.svgFiles.has(fileName)){
            let svg = await fetch(fast.routes.icons+fileName+".svg").then((response) => response.text());
            if(!this.svgFiles.has(fileName)) {this.svgFiles.set(fileName, svg);};
            return svg;
        }
        else{
            return this.svgFiles.get(fileName);
        }
    }

    //     async applyStyles(cssFileName) {
    //     try {
    //         const cssText = await this.getCssFile(cssFileName);
    //         const styleElement = document.createElement('style');
    //         styleElement.textContent = cssText;
    //         this.shadowRoot.appendChild(styleElement);
    //         this.styleLoaded = true;
    //         this.shadowRoot.appendChild(this.notification); // Adjuntar el contenido después de cargar el CSS
    //         this.updateAttributes(); // Llama a los métodos de actualización de atributos después de cargar el CSS
    //     } catch (error) {
    //         console.error('Error loading CSS file:', error);
    //     }
    // }

}