import { Data } from '../data.js'

class Design extends Data{
    id;
    description;    
    functionUnitMap;
    constructor() {        
        super()
        this.functionUnitMap = {}
        
    }
    
    getFunctionalUnit(id){
        return this.functionUnitMap[id]       
    }

    getFunctionalUnits(ids){
        if(ids&&ids.length>0){
            //Can also use cache system to make things faster
            return ids.map(id=>this.functionUnitMap[id]).filter(v=>!!v);
        }else{
            return []
        }
    }

    add(functionalUnit){
        if(this.functionUnitMap[functionalUnit.id]){
            this.functionUnitMap[functionalUnit.id].update(functionalUnit)
            
        }else{
            this.functionUnitMap[functionalUnit.id]=functionalUnit
            functionalUnit.designId=this.id;
        }
        return this.functionUnitMap[functionalUnit.id]
    }
}

class FunctionUnit extends Data{
    type;
    label;
    id;
    designId;
    childDesign;
    data;
    description;
    static instances=[];
    constructor(type, label, id, designId) {
        super()
        this.type = type
        this.label = label
        this.id = id 
        this.designId = designId            
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
    getChildDesign(){
        if(!childDesign)
        childDesign=new Design(this.id,this.label,this.description) ;
        return childDesign
    }
    update(functionUnit){
        this.description=functionUnit.description
        this.type=functionUnit.type
        this.label=functionUnit.label
        this.data=functionUnit.data;
        this.designId=functionUnit.designId;
        this.childDesign=functionUnit.childDesign;
    }
}




class Input extends FunctionUnit {
    processIdentifiers;
    constructor(label, id, processIdentifiers) {
        super('inputs', label, id)
        this.processIdentifiers = new Set(processIdentifiers)
    }
    next(){
        return this.processIdentifiers
    }
    update(input){
        super.update(input)
        this.processIdentifiers=new Set([...this.processIdentifiers,...input.processIdentifiers])
    }

}
class Process extends FunctionUnit {
    outputIdentifiers;
    inputIdentifiers;

    constructor(label, id, inputIdentifiers, outputIdentifiers) {
        super('processes', label, id)
        this.inputIdentifiers = new Set(inputIdentifiers)
        this.outputIdentifiers = new Set(outputIdentifiers)
    }
    next(){
        return this.outputIdentifiers
    }
    previous(){
        return this.inputIdentifiers
    }
    update(process){
        super.update(process)
        this.inputIdentifiers=new Set([...this.inputIdentifiers,...process.inputIdentifiers])
        this.outputIdentifiers=new Set([...this.outputIdentifiers,...process.outputIdentifiers])
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
    constructor(label, id, processIdentifiers) {
        super('outputs', label, id)
        this.processIdentifiers = new Set(processIdentifiers)
    }

    previous(){
        return this.processIdentifiers
    }
    update(output){
        super.update(output)
        this.processIdentifiers=new Set([...this.processIdentifiers,...output.processIdentifiers])
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
            .map(inputIdentifier => new Input(inputIdentifier, inputIdentifier, [process.id]))
            .forEach(input => this.addInput(input))

        Array.from([...process.outputIdentifiers])
            .filter(outputIdentifier => !this.getFunctionalUnit(outputIdentifier))
            .map(outputIdentifier => new Output(outputIdentifier, outputIdentifier, [process.id]))
            .forEach(output => this.addOutput(output))
        
        super.add(process)
        this.publish('change')
        
    }
    get types(){
        return ['inputs','processes','outputs']
    }
}



export {LogicDesign,Design,Input,Output,Process,FunctionUnit}
