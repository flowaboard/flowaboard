import { Data } from '../data.js'

class FunctionUnit extends Data{
    type;
    label;
    id;
    data;
    description;
    constructor(type, label, id) {
        super()
        this.type = type
        this.label = label
        this.id = id        
        FunctionUnit.functionUnits.set(id,this)
    }
    getUi(){
        return null
    }
    next(){
        return []
    }
    previous(){
        return []
    }
    static functionUnits=new Map()
}
class Input extends FunctionUnit {
    processIdentifiers;
    design;
    constructor(type, label, id, processIdentifiers) {
        super(type, label, id)
        this.processIdentifiers = new Set(processIdentifiers)
    }
    next(){
        return this.processIdentifiers
    }

}
class Process extends FunctionUnit {
    outputIdentifiers;
    inputIdentifiers;

    constructor(type, label, id, inputIdentifiers, outputIdentifiers) {
        super(type, label, id)
        this.inputIdentifiers = new Set(inputIdentifiers)
        this.outputIdentifiers = new Set(outputIdentifiers)
    }
    next(){
        return this.outputIdentifiers
    }
    previous(){
        return this.inputIdentifiers
    }
    getActiveUi(){
        var div=document.createElement('div');
        div.innerHTML=`
            Hello i am new active sate
        `
        return div;
    }
    getUi(status){
        switch (status) {
            case 'active':
                return this.getActiveUi()
                break;
        
            default:
                return null
                break;
        }
    }
}
class Output extends FunctionUnit {
    processIdentifiers;
    constructor(type, label, id, processIdentifiers) {
        super(type, label, id)
        this.processIdentifiers = new Set(processIdentifiers)
    }

    previous(){
        return this.processIdentifiers
    }

}

class Design extends Data{
    inputs;
    _inputMap;
    outputs;
    _outputMap
    processes;
    _processMap;
    _linkMap;
    id;
    constructor() {
        super()
        this.inputs = []
        this.outputs = []
        this.processes = []
    }
    
    getFunctionalUnit(id){
        return FunctionUnit.functionUnits.get(id)
    }

    add(functionalUnit){
        if(functionalUnit instanceof Input){
            addInput(functionalUnit)
        }
        if(functionalUnit instanceof Process){
            addProcess(functionalUnit)
        }
        if(functionalUnit instanceof Output){
            addOutput(functionalUnit)
        }
    }

    addInput(input) {
        this.inputs.push(input)

        input.processIdentifiers.forEach(processIdentifier => this.getFunctionalUnit(processIdentifier).inputIdentifiers.add(input.id))
        this.publish('change')
        
    }
    addOutput(output) {
        this.outputs.push(output)

        output.processIdentifiers.forEach(processIdentifier => this.getFunctionalUnit(processIdentifier).outputIdentifiers.add(output.id))

        this.publish('change')
    }
    addProcess(process) {
        this.processes.push(process)

        Array.from([...process.inputIdentifiers])
            .filter(inputIdentifier => !this.getFunctionalUnit(inputIdentifier))
            .map(inputIdentifier => new Input(inputIdentifier, inputIdentifier, inputIdentifier, [process.id]))
            .forEach(input => this.addInput(input))

        Array.from([...process.outputIdentifiers])
            .filter(outputIdentifier => !this.getFunctionalUnit(outputIdentifier))
            .map(outputIdentifier => new Output(outputIdentifier, outputIdentifier, outputIdentifier, [process.id]))
            .forEach(output => this.addOutput(output))

        // Array.from([...process.inputIdentifiers])
        //     .filter(inputIdentifier => this._inputMap[inputIdentifier])
        //     .map(inputIdentifier => this._inputMap[inputIdentifier])
        //     .forEach(input => input.processIdentifiers.add(process.id))

        // Array.from([...process.outputIdentifiers])
        //     .filter(outputIdentifier => !this._outputMap[outputIdentifier])
        //     .map(outputIdentifier => this._outputMap[outputIdentifier])
        //     .forEach(output => output.processIdentifiers.add(process.id))
        
        this.publish('change')
        
    }
}

export {Design,Input,Output,Process,FunctionUnit}
