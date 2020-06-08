import { Data } from '../data.js'

class FunctionUnit extends Data{
    type;
    functionUnits;
    label;
    uniqueIdentifier;
    designIdentifier;
    constructor(type, label, uniqueIdentifier) {
        super()
        this.type = type
        this.label = label
        this.uniqueIdentifier = uniqueIdentifier
    }
    getUi(){
       return document.createElement('div');
    }
    static functionUnits={}
    static register(functionUnitName,functionUnit){
        FunctionUnit.functionUnits[functionUnitName]=functionUnit
    }
}
class Input extends FunctionUnit {
    processIdentifiers;
    design;
    constructor(type, label, uniqueIdentifier, processIdentifiers) {
        super(type, label, uniqueIdentifier)
        this.processIdentifiers = new Set(processIdentifiers)
    }

}
class Process extends FunctionUnit {
    outputIdentifiers;
    inputIdentifiers;

    constructor(type, label, uniqueIdentifier, inputIdentifiers, outputIdentifiers) {
        super(type, label, uniqueIdentifier)
        this.inputIdentifiers = new Set(inputIdentifiers)
        this.outputIdentifiers = new Set(outputIdentifiers)
    }
}
class Output extends FunctionUnit {
    processIdentifiers;
    constructor(type, label, uniqueIdentifier, processIdentifiers) {
        super(type, label, uniqueIdentifier)
        this.processIdentifiers = new Set(processIdentifiers)
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
    uniqueIdentifier;
    constructor() {
        super()
        this.inputs = []
        this.outputs = []
        this.processes = []
        this._inputMap = {}
        this._outputMap = {}
        this._processMap = {}
        this._linkMap = {}
    }
    addInput(input) {
        this.inputs.push(input)

        this._inputMap[input.uniqueIdentifier] = input

        input.processIdentifiers.forEach(processIdentifier => this._processMap[processIdentifier].inputIdentifiers.add(input.uniqueIdentifier))
        this.dispatchEvent('change')
        
    }
    addOutput(output) {
        this.outputs.push(output)

        this._outputMap[output.uniqueIdentifier] = output

        output.processIdentifiers.forEach(processIdentifier => this._processMap[processIdentifier].outputIdentifiers.add(output.uniqueIdentifier))

        this.dispatchEvent('change')
    }
    addProcess(process) {
        this.processes.push(process)
        this._processMap[process.uniqueIdentifier] = process

        Array.from([...process.inputIdentifiers])
            .filter(inputIdentifier => !this._inputMap[inputIdentifier])
            .map(inputIdentifier => new (FunctionUnit.functionUnits[inputIdentifier]||Input)(inputIdentifier, inputIdentifier, inputIdentifier, [process.uniqueIdentifier]))
            .forEach(input => this.addInput(input))

        Array.from([...process.outputIdentifiers])
            .filter(outputIdentifier => !this._outputMap[outputIdentifier])
            .map(outputIdentifier => new Output(outputIdentifier, outputIdentifier, outputIdentifier, [process.uniqueIdentifier]))
            .forEach(output => this.addOutput(output))

        Array.from([...process.inputIdentifiers])
            .filter(inputIdentifier => this._inputMap[inputIdentifier])
            .map(inputIdentifier => this._inputMap[inputIdentifier])
            .forEach(input => input.processIdentifiers.add(process.uniqueIdentifier))

        Array.from([...process.outputIdentifiers])
            .filter(outputIdentifier => !this._outputMap[outputIdentifier])
            .map(outputIdentifier => this._outputMap[outputIdentifier])
            .forEach(output => output.processIdentifiers.add(process.uniqueIdentifier))
        
        this.dispatchEvent('change')
        
    }
}

export {Design,Input,Output,Process,FunctionUnit}
