import { DesignElement, FlowDesigns, Process, Input, Output } from '/flowdesign/design.js';



class AIDesign extends FlowDesigns.ProcessDesign {
    
    fromJSON(json) {
        var parsed = JSON.parse(json)
        this.label = parsed.label;
        this.id = parsed.id;
        this.description = parsed.description;
        this.config = parsed.config
    }
    execute() {
        console.log("Executing", JSON.stringify(this))
    }
    toJavaScript() {

    }
    toJSON(key) {

        return {
            label: this.label,
            id: this.id,
            description: this.description,
        };
    }   

}
class AIModel extends Process {
    
}
class AIInput extends Input {

}
class AIOuput extends Output {

}


export  {AIDesign as default,AIInput,AIModel,AIOuput}