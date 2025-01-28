export const QuantumEdit = class extends Quantum {

    constructor(props){
        super();
        
    }

    async #getCss(){
    return await Quantum.getCss('QuantumEdit');
}
    
    async connectedCallback() {
        const cssContent = await this.#getCss();

        if (cssContent) {
            const style = document.createElement('style');
            style.textContent = cssContent;
            this.shadowRoot.appendChild(style);
        }

        this.render();
    }

    render() {
        this.shadowRoot.innerHTML += `
            <div class="input-group">
                <input type="text" id="quantum-input" class="input" required />
                <label for="quantum-input" class="user-label">Enter text</label>
            </div>
        `;
    }

}

customElements.define('quantum-edit', QuantumEdit);
customElements.define('quantum-edit', QuantumEdit);
