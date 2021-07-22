import { Data } from '../../data/data.js'

class Design extends Data{
    id;
    description; 
    label;
    parentDesignId;   
    functionUnitMap;
    designElements=[]
    constructor(label,id,description) {   
             
        super()
        this.functionUnitMap = {}
        this.id=id;
        this.description=description;
        this.label=label;
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
            functionalUnit.parentDesignId=this.id;
            this.designElements.push(functionalUnit)
        }
        return this.functionUnitMap[functionalUnit.id]
    }
    get types(){
        return ['designElements']
    }

    _flowConfig;
    get flowConfig(){
        return this._flowConfig||{}
    }
    set flowConfig(flowConfig){
        this._flowConfig=flowConfig||{}
        this.publish('change') 
    }
}

class DesignElement extends Data{
    type;
    label;
    id;
    designId;
    childDesign;
    data;
    description;
    static instances=[];
    constructor(label,id,description, type, designId) {
        super()
        this.type = type||'designElements'
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
    update(DesignElement){
        this.description=DesignElement.description
        this.type=DesignElement.type
        this.label=DesignElement.label
        this.data=DesignElement.data;
        this.designId=DesignElement.designId;
        this.childDesign=DesignElement.childDesign;
    }
}




class Input extends DesignElement {
    processIdentifiers;
    constructor(label,id,description, processIdentifiers) {
        super( label,id,description ,'inputs')
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
class Process extends DesignElement {
    outputIdentifiers;
    inputIdentifiers;

    constructor(label,id,description, inputIdentifiers, outputIdentifiers) {
        super( label,id,description,'processes')
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
class Output extends DesignElement {
    processIdentifiers;
    constructor(label,id,description, processIdentifiers) {
        super(label,id,description, 'outputs')
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

    constructor(label,id,description) {
        super(label,id,description)
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
            .map(inputIdentifier => new Input(inputIdentifier, inputIdentifier,inputIdentifier, [process.id]))
            .forEach(input => this.addInput(input))

        Array.from([...process.outputIdentifiers])
            .filter(outputIdentifier => !this.getFunctionalUnit(outputIdentifier))
            .map(outputIdentifier => new Output(outputIdentifier, outputIdentifier,outputIdentifier, [process.id]))
            .forEach(output => this.addOutput(output))
        
        super.add(process)
        this.publish('change')
        
    }
    get types(){
        return ['inputs','processes','outputs']
    }
}

class EquationDesign extends LogicDesign{
    
}


class ListDesign extends Design{

}

const FlowDesigns={
    LogicDesign,
    ListDesign,
    EquationDesign
}


export {FlowDesigns,Design,Input,Output,Process,DesignElement}
