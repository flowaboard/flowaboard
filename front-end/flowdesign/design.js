import { Data } from '../data/data.js'
import Wiki from '../lib/wiki/wiki.js';
import Utility from '../lib/utility.js';



class Design extends Data {
    id;
    description;
    label;
    parentDesignId;
    functionUnitMap;
    designElements = [];

    rootEndPoint;

    constructor(label, id, description, designElementsId) {

        super()
        this.functionUnitMap = {}
        this.id = id;
        this.description = description;
        this.designElementsId = designElementsId;
        this.label = label;
    }

    _description;
    _WikiDescription;
    set description(value) {
        if (Wiki.isWikiUrl(value)) {
            this.updateWikiDescription()
        }
        this._description = value
    }
    get description() {
        return this.__WikiDescription || this._description
    }

    async updateWikiDescription() {
        this._WikiDescription = (await Wiki.fetchSummary(this.description)).description;
        this.publish('change')
    }

    getElement(id) {
        return this.functionUnitMap[id]
    }

    getElements(ids) {
        if (ids && ids.length > 0) {
            //Can also use cache system to make things faster
            return ids.map(id => this.functionUnitMap[id]).filter(v => !!v);
        } else if (ids && ids.length == 0) {
            return []
        } else {
            return this.designElements
        }
    }

    add(designElement) {

        if (this.functionUnitMap[designElement.id]) {
            this.functionUnitMap[designElement.id].update(designElement)

        } else {
            this.functionUnitMap[designElement.id] = designElement
            this.designElements.push(designElement)
            designElement.parent = this;
        }
        if (!this._types.find((v) => v == designElement.type)) {
            this._types.push(designElement.type)
        }
        return this.functionUnitMap[designElement.id]
    }
    addFromJSON(json) {
        var parsed = JSON.parse(json)
        const label = parsed.label;
        const id = parsed.id;
        const description = parsed.description;
        const designId = parsed.designId;
        const type = parsed.designId;
        this.add(new DesignElement(label, id, description, type, designId))
    }
    async addAll(designElements) {
        (await this.loadDesignElements(designElements)).forEach(de => this.add(de))
    }
    _types = []
    get types() {
        return [...this._types]
    }

    _flow;

    get flow() {
        this._flow;
    }

    set flow(value) {
        _flow = value;
    }

    _flowConfig;
    get flowConfig() {
        return this._flowConfig || {}
    }
    set flowConfig(flowConfig) {
        this._flowConfig = flowConfig || {}
        this.publish('change')
    }

    getFlowActions() {
        return (this.flowConfig.flowAction || {}).buttons || []
    }

    async loadDesignElements(designElementsId) {
        let designElements;
        if (typeof designElementsId != 'string') {
            designElements = designElements
        } else if (Utility.isJSURL(designElementsId)) {
            designElements = (await import(designElementsId)).default;
        } else if (Utility.isFlowURL(designElementsId)) {
            designElements = Design.getNewInstance(await fetch(designElementsId));
        } else if (Utility.isJSUrlPath(designElementsId)) {
            designElements = (await import(location.origin + designElementsId)).default;
        } else if (Utility.isFlowUrlPath(designElementsId)) {
            designElements = Design.getNewInstance(await fetch(location.origin + designElementsId));
        } else {

        }
        return designElements;
    }
    toJSON(key) {

        return {
            label: this.label,
            id: this.id,
            description: this.description,
            designElements: this.designElements,

        };
    }

    fromJSON(json) {
        var parsed = JSON.parse(json)
        this.label = parsed.label;
        this.id = parsed.id;
        this.description = parsed.description;
        this.config = parsed.config
        this.designElementsId = parsed.designElementsId;
        (parsed.designElements || []).forEach(designElement => this.addFromJSON(designElement))
    }
    async execute(...inputs) {
        console.log("Executing", JSON.stringify(this))
        //return this.outputs.map(output=>output.execute(...inputs))
    }


}

class DesignElement extends Data {
    type;
    label;
    id;
    designId;
    data;
    description;
    parent;
    config;
    static instances = [];
    constructor(label, id, description, type, designId, config) {
        super()
        this.type = type || 'designElements';
        this.label = label;
        this.id = id;
        this.designId = designId;
        this.config = config || {};
        this.description = description;
    }
    _description;
    set description(value) {
        this._description = value
        if (Wiki.isWikiUrl(value)) {
            this.updateWikiDescription()
        }
    }
    get description() {
        return this._description
    }

    async updateWikiDescription() {
        this._Wikidescription = (await Wiki.fetchSummary(this.description)).description;
        this.publish('change')
    }

    async getUi() {
        return null
    }
    next() {
        return []
    }
    previous() {
        return []
    }

    update(designElement) {
        this.description = designElement.description
        this.type = designElement.type
        this.label = designElement.label
        this.data = designElement.data;
        this.designId = designElement.designId;
    }
    async toDesign() {
        if (!this.design && this.designId) {
            return await this.loadDesign(this.designId);
        } else {
            return this.design
        }
    }

    getRoot(root) {
        return this.root || this.parent.root || root || ''
    }

    async loadDesign(designId, root) {
        let design;
        if (Utility.isJSURL(designId)) {
            design = (await import(designId)).default;
        } else if (Utility.isFlowURL(designId)) {
            design = Design.getNewInstance(await fetch(designId));
        } else if (Utility.isJSUrlPath(designId)) {
            design = (await import(this.getRoot(root) + designId)).default;
        } else if (Utility.isFlowUrlPath(designId)) {
            design = Design.getNewInstance(this.getRoot(root) + designId);
        } else {
            console.log('future')
        }
        return design;
    }

    toJSON(key) {

        return {
            label: this.label,
            id: this.id,
            description: this.description,
            designId: this.designId
        };
    }
    static getRootDomain() {
        return location.origin
    }


    get value() {
        return this.parent.getElements(this.previous()).map(previous => previous.execute())
    }

    async execute() {
        return await Promise.all(this.value);
    }

}




class Input extends DesignElement {
    processIdentifiers;
    constructor(label, id, description, processIdentifiers, designId, config) {
        super(label, id, description, 'inputs', designId, config)
        this.processIdentifiers = new Set(processIdentifiers)
    }
    next() {
        return this.processIdentifiers
    }
    update(input) {
        super.update(input)
        this.processIdentifiers = new Set([...this.processIdentifiers, ...input.processIdentifiers])
    }

}
class Process extends DesignElement {
    outputIdentifiers;
    inputIdentifiers;

    constructor(label, id, description, designId, config, inputIdentifiers, outputIdentifiers) {
        super(label, id, description, 'processes', designId, config)
        this.inputIdentifiers = new Set(inputIdentifiers)
        this.outputIdentifiers = new Set(outputIdentifiers)
    }
    next() {
        return [...this.outputIdentifiers]
    }
    previous() {
        return [...this.inputIdentifiers]
    }
    update(process) {
        super.update(process)
        this.inputIdentifiers = new Set([...this.inputIdentifiers, ...process.inputIdentifiers])
        this.outputIdentifiers = new Set([...this.outputIdentifiers, ...process.outputIdentifiers])
    }
}
class Output extends DesignElement {
    processIdentifiers;
    constructor(label, id, description, processIdentifiers, designId, config) {
        super(label, id, description, 'outputs', designId, config)
        this.processIdentifiers = new Set(processIdentifiers)
    }

    previous() {
        return [...this.processIdentifiers]
    }
    update(output) {
        super.update(output)
        this.processIdentifiers = new Set([...this.processIdentifiers, ...output.processIdentifiers])
    }

}


class IODesign extends Design {
    inputs;
    outputs;
    processes;

    constructor(label, id, description, designElementsId) {
        super(label, id, description, designElementsId)
        this.inputs = []
        this.outputs = []
        this.processes = []
    }


    add(ioElement) {
        if (ioElement instanceof Input) {
            this.addInput(ioElement)
        }
        if (ioElement instanceof Process) {
            this.addProcess(ioElement)
        }
        if (ioElement instanceof Output) {
            this.addOutput(ioElement)
        }
    }

    addInput(input) {
        this.inputs.push(super.add(input))

        this.getElements([...input.processIdentifiers || []]).forEach(fu => fu.inputIdentifiers.add(input.id))


        this.publish('change')
    }
    addOutput(output) {
        this.outputs.push(super.add(output))

        this.getElements([...output.processIdentifiers || []]).forEach(fu => fu.outputIdentifiers.add(output.id))

        super.add(output)
        this.publish('change')

    }
    addProcess(process) {
        this.processes.push(super.add(process))

        Array.from([...process.inputIdentifiers])
            .filter(inputIdentifier => !this.getElement(inputIdentifier))
            .map(inputIdentifier => new Input(inputIdentifier, inputIdentifier, inputIdentifier, [process.id]))
            .forEach(input => this.addInput(input))

        Array.from([...process.outputIdentifiers])
            .filter(outputIdentifier => !this.getElement(outputIdentifier))
            .map(outputIdentifier => new Output(outputIdentifier, outputIdentifier, outputIdentifier, [process.id]))
            .forEach(output => this.addOutput(output))

        super.add(process)
        this.publish('change')

    }
    get types() {
        return ['inputs', 'processes', 'outputs']
    }
    async execute() {
        return this.outputs.map(output => output.execute())
    }
}

class ProcessDesign extends IODesign {

}

class Step extends Process {
    constructor(label, id, description, designId, config, inputIdentifiers, outputIdentifiers) {
        super(label, id, description, 'step', designId, config)
        this.inputIdentifiers = new Set(inputIdentifiers)
        this.outputIdentifiers = new Set(outputIdentifiers)

    }
}

class SerialDesign extends IODesign {
    firstStep;
    lastStep;
    add(ioElement) {
        if (ioElement instanceof Step) {
            this.addStep(ioElement)
        } else {
            super.add(ioElement)
        }
    }
    addStep(step) {
        if (this.lastStep) {
            this.lastStep.outputIdentifiers = [step.id]
            step.inputIdentifiers.add(this.lastStep.id)
            step.outputIdentifiers = this.outputs.map(output => output.id)
        } else {
            this.firstStep = step
            step.inputIdentifiers = this.inputs.map(input => input.id)
            step.outputIdentifiers = this.outputs.map(output => output.id)
        }


        this.lastStep = step;
        super.addProcess(step)
        //Need to find better way
        step.type = 'step' + this.processes.length;

    }
    async execute() {
        return this.lastStep.execute()
    }

    get types() {
        var steps = ['inputs']
        for (let i = 1; i <= this.processes.length; i++) {
            steps.push('step' + i)
        }
        steps.push('outputs')
        return steps;
    }

}

class ParallelDesign extends IODesign {

}

class OptionalDesign extends IODesign {

}


class ListDesign extends Design {

}

const FlowDesigns = {
    ProcessDesign,
    SerialDesign,
    ParallelDesign,
    OptionalDesign,
    IODesign,
    ListDesign
}


export { FlowDesigns, Design, Input, Output, Process, Step, DesignElement }
