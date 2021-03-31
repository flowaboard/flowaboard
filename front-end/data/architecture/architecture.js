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
    get design(){
        //Unnecessary complex
        var design = Design.functionUnitDesign.get(this,design)
        if(!design){
            design=new Design()    

            Design.functionUnitDesign.set(this,design)
            Design.designParentDesign.set(design,Design.functionUnitParentDesign.get(this))
        }
        return design;
    }
    static functionUnits=new Map()
}
class Design extends Data{

    id;
    functionUnits

    static functionUnitDesign=new WeakMap();
    static designParentDesign=new WeakMap();
    static functionUnitParentDesign=new WeakMap();
    constructor() {
        super()
        this.functionUnits = []
    }
    
    getFunctionalUnit(id){
        if(id){
            //Can also use cache system to make things faster
            return [...this.functionUnits].find(fu=>fu.id==id);
        }else{
            return []
        }
    }

    getFunctionalUnits(ids){
        if(ids&&ids.length>0){
            //Can also use cache system to make things faster
            return [...this.functionUnits].filter(fu=>ids.indexOf(fu.id));
        }else{
            return []
        }
    }

    add(functionalUnit){
        this.functionUnits.push(functionalUnit)
        Design.functionUnitParentDesign.set(functionalUnit,this)
    }
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
        var div=document.createElement('js-input');
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

class LogicDesign extends Design{
    inputs;
    outputs;
    processes;

    constructor() {
        super()
        this.inputs = []
        this.outputs = []
        this.processes = []
    }
    

    add(functionalUnit){
        if(functionalUnit instanceof Input){
            this.addInput(functionalUnit)
        }
        if(functionalUnit instanceof Process){
            this.addProcess(functionalUnit)
        }
        if(functionalUnit instanceof Output){
            this.addOutput(functionalUnit)
        }
    }

    addInput(input) {
        this.inputs.push(input)

        this.getFunctionalUnits(input.processIdentifiers).forEach(fu => fu.inputIdentifiers.add(input.id))
        
        super.add(input)
        this.publish('change')         
    }
    addOutput(output) {
        this.outputs.push(output)

        this.getFunctionalUnits(output.processIdentifiers).forEach(fu => fu.outputIdentifiers.add(output.id))
        
        super.add(output)
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
        
        super.add(process)
        this.publish('change')
        
    }
    get types(){
        return ['inputs','processes','outputs']
    }
}



export {LogicDesign,Design,Input,Output,Process,FunctionUnit}
