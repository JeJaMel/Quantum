export const QuantumEdit = class extends Quantum {
    static observedAttributes = ["caption"];

    constructor(props){
        super();
        this.name = "QuantumEdit"
        this.props = props;
        this._hiddenValue = "";
        this.built = () => {};
        this.attachShadow({mode: "open"});
        this._reactive = false;
        this._message = "";    
    }

    async #getCss(){
    return await quantum.getCss('QuantumEdit');
}

    #getTemplate(){
        return `
            <div class="FastEditContainer">
                <input class="FastEdit">
                <label class="FastEditLabel"></label>
            </div>
        `
    }

    #checkAttributes(){
        return new Promise(async (resolve, reject) => {
            try {
                for(let attr of this.getAttributeNames()){ 
                    if(attr.substring(0,2)!="on"){ 
                        this[attr] = this.getAttribute(attr);
                    }
                    else{ 
                        switch(attr) {  
                            case 'onescape' : this.addEventListener('escape', ()=>{eval(this.getAttribute(attr))}); break;
                            case 'onenter' : this.addEventListener('enter', ()=>{eval(this.getAttribute(attr))}); break;
                        }
                    }
                }
                if(this.getAttribute('id')){ await fast.createInstance('FastEdit', {'id':this.getAttribute('id')}); this['id'] = this.getAttribute('id');}
                resolve(this);
            } catch (error) {
                reject(error);
            }
        })
    }

    async #checkProps() {
        try {
            if (this.props) {
                for (let attr in this.props) {
                    switch (attr) {
                        case 'style':
                            for (let attrcss in this.props.style) {
                                this.mainElement.style[attrcss] = this.props.style[attrcss];
                            }
                            break;
                        case 'events':
                            for (let attrevent in this.props.events) {
                                this.mainElement.addEventListener(attrevent, this.props.events[attrevent]);
                            }
                            break;
                        default:
                            this.setAttribute(attr, this.props[attr]);
                            this[attr] = this.props[attr];
                            if (attr === 'id') {
                                await fast.createInstance('FastEdit', { 'id': this[attr] });
                            }
                    }
                }
            }
            return this;
        } catch (error) {
            throw error;
        }
    }
    

    async #render() {
        try {
            let sheet = new CSSStyleSheet();
            sheet.replaceSync(await this.#getCss());
            this.shadowRoot.adoptedStyleSheets = [sheet];
    
            this.template = document.createElement('template');
            this.template.innerHTML = this.#getTemplate();
            let tpc = this.template.content.cloneNode(true);
    
            this.mainElement = tpc.firstChild.nextSibling;
            this.inputElement = this.mainElement.firstChild.nextSibling;
            this.labelElement = this.mainElement.firstChild.nextSibling.nextSibling.nextSibling;
    
            this.shadowRoot.appendChild(this.mainElement);
            
            return this;

        } catch (error) {
            throw new Error(`Error en metodo render: ${error.message}`);
        }
    }

    builtEvents() {
        // Hacer que el label enfoque el input al hacer clic
        this.labelElement.addEventListener('click', () => this.inputElement.focus());
    
        // Manejar foco y cambio en el input
        this.inputElement.addEventListener('focus', () => this.#animationUp());
        this.inputElement.addEventListener('change', () => { this.#animationUp(); this.valid(); });
    
        // Manejar eventos de teclado (Enter, Escape)
        this.inputElement.addEventListener('keyup', this.#handleKeyEvents.bind(this));
    
        // Manejar la pérdida de foco y bajar la etiqueta si está vacío
        this.inputElement.addEventListener('blur', () => {
            if (this.inputElement.value.trim() === "" && this.inputElement.type !== 'date') {
                this.#animationDown();
            }
        });
    }

    #handleKeyEvents(ev) {
        switch (ev.key) {
            case 'Enter':
                this.dispatchEvent(new CustomEvent("enter", { bubbles: true }));
                break;
            case 'Escape':
                this.dispatchEvent(new CustomEvent("escape", { bubbles: true }));
                break;
        }
        this.#animationUp();
        if (this._reactive) fast.react();
    }
    


    

    focus() {
        this.inputElement.focus();
        return this;
    }

    addToBody() {
        document.body.appendChild(this);
        return this;
    }

    getEdit() {
        return this.inputElement;
    }

    clean() {
        this.inputElement.value = "";
        return this;
    }

    #animationUp() {
        this.labelElement.style.animation = "animationLabelUp .5s both";
        return this;
    }

    #animationDown() {
        this.labelElement.style.animation = "animationLabelDown .5s both";
        return this;
    }

    getIntValue() {
        return parseInt(this.value, 10);
    }

    getFloatValue(dec) {
        let v = parseFloat(this.value);
        return dec ? parseFloat(v.toFixed(dec)) : v;
    }

    // Método para evitar código repetitivo en setters
    setAttributeAndUpdate(attr, val) {
        this.setAttribute(attr, val);
        this.inputElement[attr] = val;
    }

    get caption() {
        return this.labelElement.innerText;
    }
    set caption(val) {
        this.setAttribute("caption", val);
        this.labelElement.innerText = val;
        this.dispatchEvent(new CustomEvent("changeCaption", { bubbles: true }));
    }

    get value() {
        return this.inputElement.value;
    }
    set value(val) {
        this.setAttribute("value", val);
        this.inputElement.value = val;
        this.#animationUp();
    }

    get hiddenValue() {
        return this._hiddenValue;
    }
    set hiddenValue(val) {
        this.setAttribute("hiddenValue", val);
        this._hiddenValue = val;
    }

    get disabled() {
        return this.inputElement.disabled;
    }
    set disabled(val) {
        this.setAttributeAndUpdate("disabled", val);
    }

    get reactive() {
        return this._reactive;
    }
    set reactive(val) {
        this.setAttributeAndUpdate("reactive", val);
        this._reactive = val;
    }

    get type() {
        return this.inputElement.type;
    }
    set type(val) {
        this.setAttributeAndUpdate("type", val);
    }

    get required() {
        return this.inputElement.required;
    }
    set required(val) {
        this.setAttributeAndUpdate("required", val);
    }

    get message() {
        return this._message;
    }
    set message(val) {
        this.setAttribute("message", val);
        this._message = val;
    }

    get max() {
        return this.inputElement.max;
    }
    set max(val) {
        this.setAttributeAndUpdate("max", val);
    }

    get min() {
        return this.inputElement.min;
    }
    set min(val) {
        this.setAttributeAndUpdate("min", val);
    }

    get maxlength() {
        return this.inputElement.maxlength;
    }
    set maxlength(val) {
        this.setAttributeAndUpdate("maxlength", val);
    }

    get minlength() {
        return this.inputElement.minlength;
    }
    set minlength(val) {
        this.setAttributeAndUpdate("minlength", val);
    }

    get pattern() {
        return this.inputElement.pattern;
    }
    set pattern(val) {
        this.setAttributeAndUpdate("pattern", val);
    }

    get readonly() {
        return this.inputElement.readOnly;
    }
    set readonly(val) {
        if (this.readonly !== val) {
            this.style.opacity = val ? 0.4 : 1;
            this.setAttributeAndUpdate("readonly", val);
        }
    }

    
}

if (!customElements.get ('quantum-edit')) {
    customElements.define ('quantum-edit', QuantumEdit);
}
