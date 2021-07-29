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

    constructor(label, id, description) {

        super()
        this.functionUnitMap = {}
        this.id = id;
        this.description = description;
        if (Wiki.isWikiUrl(description)) {
            this.updateWikiDescription()
        }
        this.label = label;
    }

    _description;
    set description(value) {
        if (Wiki.isWikiUrl(value)) {
            this.updateWikiDescription()
        } else {
            this._description = value
        }
    }
    get description() {
        return this._description
    }

    async updateWikiDescription() {
        this._description = (await Wiki.fetchSummary(this.description)).description;
        this.publish('change')
    }

    getFunctionalUnit(id) {
        return this.functionUnitMap[id]
    }

    getFunctionalUnits(ids) {
        if (ids && ids.length > 0) {
            //Can also use cache system to make things faster
            return ids.map(id => this.functionUnitMap[id]).filter(v => !!v);
        } else {
            return []
        }
    }

    add(designElement) {
        if (this.functionUnitMap[designElement.id]) {
            this.functionUnitMap[designElement.id].update(designElement)

        } else {
            this.functionUnitMap[designElement.id] = designElement
            designElement.parentDesignId = this.id;
            this.designElements.push(designElement)
        }
        if(this._types.indexOf(designElement.type)){
            this._types.push(designElement.type)
        }
        return this.functionUnitMap[designElement.id]
    }
    async addDesignElements(designElements){
        (await Design.loadDesignElements(designElements)).forEach(de=>this.add(de))
    }
    _types=[]
    get types() {
        return [...this._types]
    }

    _flow;

    get flow(){
        this._flow;
    }

    set flow(value){
        _flow=value;
    }

    _flowConfig;
    get flowConfig() {
        return this._flowConfig || {}
    }
    set flowConfig(flowConfig) {
        this._flowConfig = flowConfig || {}
        this.publish('change')
    }

    static async loadDesignElements(designElementsId) {
        let designElements;
        if(typeof designElementsId !='string'){
            designElements = designElements
        }else if (Utility.isJSURL(designElementsId)) {
            designElements = (await import(designElementsId)).default;
        } else if (Utility.isFlowURL(designElementsId)) {
            designElements = Design.getNewInstance(await fetch(designElementsId));
        } else if (Utility.isJSUrlPath(designElementsId)) {
            designElements = (await import(location.href + designElementsId)).default;
        } else if (Utility.isFlowUrlPath(designElementsId)) {
            designElements = Design.getNewInstance(await fetch(location.href + designElementsId));
        } else {
            
        }
        return designElements;
    }

}

class DesignElement extends Data {
    type;
    label;
    id;
    designId;
    childDesign;
    data;
    description;
    config;
    static instances = [];
    constructor(label, id, description, type, designId, config) {
        super()
        this.type = type || 'designElements';
        this.label = label;
        this.id = id;
        this.designId = designId;
        this.config = config;
        this.description = description;
        if (Wiki.isWikiUrl(description)) {
            this.updateWikiDescription()
        }
    }
    _description;
    set description(value) {
        if (Wiki.isWikiUrl(value)) {
            this.updateWikiDescription()
        } else {
            this._description = value
        }
    }
    get description() {
        return this._description
    }

    async updateWikiDescription() {
        this._description = (await Wiki.fetchSummary(this.description)).description;
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
    getChildDesign() {
        if (!childDesign)
            childDesign = new Design(this.id, this.label, this.description);
        return childDesign
    }
    update(DesignElement) {
        this.description = DesignElement.description
        this.type = DesignElement.type
        this.label = DesignElement.label
        this.data = DesignElement.data;
        this.designId = DesignElement.designId;
        this.childDesign = DesignElement.childDesign;
    }
    async toFlowly(){
        if(this.designId){
            return await DesignElement.loadDesign(this.designId);
        }
    }

    static async loadDesign(designId) {
        let design;
        if (Utility.isJSURL(designId)) {
            design = (await import(designId)).default;
        } else if (Utility.isFlowURL(designId)) {
            design = Design.getNewInstance(await fetch(designId));
        } else if (Utility.isJSUrlPath(designId)) {
            design = (await import(location.href + designId)).default;
        } else if (Utility.isFlowUrlPath(designId)) {
            design = Design.getNewInstance(await fetch(location.href + designId));
        } else {
            console.log('future')
        }
        return design;
    }
}




class Input extends DesignElement {
    processIdentifiers;
    constructor(label, id, description, processIdentifiers, designId,config) {
        super(label, id, description, 'inputs', designId,config)
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

    constructor(label, id, description, designId, config,inputIdentifiers, outputIdentifiers) {
        super(label, id, description, 'processes', designId, config)
        this.inputIdentifiers = new Set(inputIdentifiers)
        this.outputIdentifiers = new Set(outputIdentifiers)
    }
    next() {
        return this.outputIdentifiers
    }
    previous() {
        return this.inputIdentifiers
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
        return this.processIdentifiers
    }
    update(output) {
        super.update(output)
        this.processIdentifiers = new Set([...this.processIdentifiers, ...output.processIdentifiers])
    }

}


class ProcessDessign extends Design {
    inputs;
    outputs;
    processes;

    constructor(label, id, description) {
        super(label, id, description)
        this.inputs = []
        this.outputs = []
        this.processes = []
    }


    add(functionalUnit) {
        if (functionalUnit instanceof Input) {
            this.addInput(functionalUnit)
        }
        if (functionalUnit instanceof Process) {
            this.addProcess(functionalUnit)
        }
        if (functionalUnit instanceof Output) {
            this.addOutput(functionalUnit)
        }
    }

    addInput(input) {
        this.inputs.push(super.add(input))

        this.getFunctionalUnits(input.processIdentifiers).forEach(fu => fu.inputIdentifiers.add(input.id))


        this.publish('change')
    }
    addOutput(output) {
        this.outputs.push(super.add(output))

        this.getFunctionalUnits(output.processIdentifiers).forEach(fu => fu.outputIdentifiers.add(output.id))

        super.add(output)
        this.publish('change')

    }
    addProcess(process) {
        this.processes.push(super.add(process))

        Array.from([...process.inputIdentifiers])
            .filter(inputIdentifier => !this.getFunctionalUnit(inputIdentifier))
            .map(inputIdentifier => new Input(inputIdentifier, inputIdentifier, inputIdentifier, [process.id]))
            .forEach(input => this.addInput(input))

        Array.from([...process.outputIdentifiers])
            .filter(outputIdentifier => !this.getFunctionalUnit(outputIdentifier))
            .map(outputIdentifier => new Output(outputIdentifier, outputIdentifier, outputIdentifier, [process.id]))
            .forEach(output => this.addOutput(output))

        super.add(process)
        this.publish('change')

    }
    get types() {
        return ['inputs', 'processes', 'outputs']
    }
}


class SerialProcessDesign extends Design {

}

class ParallelProcessDesign extends Design {

}

class OptionalProcessDesign extends Design {

}


class ListDesign extends OptionalProcessDesign {
    
}

const FlowDesigns = {
    SerialProcessDesign,
    ParallelProcessDesign,
    OptionalProcessDesign,
    ProcessDessign,
    ListDesign
}


export { FlowDesigns, Design, Input, Output, Process, DesignElement }
