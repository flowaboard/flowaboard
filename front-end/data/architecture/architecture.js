import { Data } from '../data.js'

class FunctionUnit extends Data{
    type;
    label;
    uid;
    constructor(type, label, uid) {
        super()
        this.type = type
        this.label = label
        this.uid = uid        
        FunctionUnit.functionUnits.set(uid,this)
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
    constructor(type, label, uid, processIdentifiers) {
        super(type, label, uid)
        this.processIdentifiers = new Set(processIdentifiers)
    }
    next(){
        return this.processIdentifiers
    }

}
class Process extends FunctionUnit {
    outputIdentifiers;
    inputIdentifiers;

    constructor(type, label, uid, inputIdentifiers, outputIdentifiers) {
        super(type, label, uid)
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
    constructor(type, label, uid, processIdentifiers) {
        super(type, label, uid)
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
    uid;
    constructor() {
        super()
        this.inputs = []
        this.outputs = []
        this.processes = []
    }
    
    getFunctionalUnit(uid){
        return FunctionUnit.functionUnits.get(uid)
    }

    addInput(input) {
        this.inputs.push(input)

        input.processIdentifiers.forEach(processIdentifier => this.getFunctionalUnit(processIdentifier).inputIdentifiers.add(input.uid))
        this.publish('change')
        
    }
    addOutput(output) {
        this.outputs.push(output)

        output.processIdentifiers.forEach(processIdentifier => this.getFunctionalUnit(processIdentifier).outputIdentifiers.add(output.uid))

        this.publish('change')
    }
    addProcess(process) {
        this.processes.push(process)

        Array.from([...process.inputIdentifiers])
            .filter(inputIdentifier => !this.getFunctionalUnit(inputIdentifier))
            .map(inputIdentifier => new Input(inputIdentifier, inputIdentifier, inputIdentifier, [process.uid]))
            .forEach(input => this.addInput(input))

        Array.from([...process.outputIdentifiers])
            .filter(outputIdentifier => !this.getFunctionalUnit(outputIdentifier))
            .map(outputIdentifier => new Output(outputIdentifier, outputIdentifier, outputIdentifier, [process.uid]))
            .forEach(output => this.addOutput(output))

        // Array.from([...process.inputIdentifiers])
        //     .filter(inputIdentifier => this._inputMap[inputIdentifier])
        //     .map(inputIdentifier => this._inputMap[inputIdentifier])
        //     .forEach(input => input.processIdentifiers.add(process.uid))

        // Array.from([...process.outputIdentifiers])
        //     .filter(outputIdentifier => !this._outputMap[outputIdentifier])
        //     .map(outputIdentifier => this._outputMap[outputIdentifier])
        //     .forEach(output => output.processIdentifiers.add(process.uid))
        
        this.publish('change')
        
    }
}

export {Design,Input,Output,Process,FunctionUnit}
