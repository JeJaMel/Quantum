import { QuantumCore } from './QuantumCore.js';

export const Quantum = class extends QuantumCore {
    constructor(props) {
        super();
        console.log("Quantum constructor");
        this.attachShadow({ mode: "open" });
        if (props) this.props = props;
        this.mapcallbackids = new Map();
        this.actZIndex = 0;
    }

    getMaxZIndex() {
        this.actZIndex++;
        return this.actZIndex;
    }

    parseBoolean(val) {
        return String(val).toLowerCase() === "true";
    }

    async createInstance(className, props) {
        if (!this.instances.has(props.id)) {
            try {
                const NewClass = await this.getClass(className);
                const instance = new NewClass(props);
                this.addInstance(props.id, instance);
                return instance;
            } catch (error) {
                console.error(`Error creando instancia de ${className}:`, error);
                return null;
            }
        }
        return this.instances.get(props.id);
    }
};
