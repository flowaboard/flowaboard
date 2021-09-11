import { DesignElement, FlowDesigns, Process, Input, Output } from '/flowdesign/design.js';



class DatabaseDesign extends FlowDesigns.ProcessDesign {
    
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
class DatabaseHandler extends Process {
    
}
class DatabaseStorage extends Input {

}
class DatabaseAction extends Output {

}
class DatabaseResult extends Output {

}


export  {DatabaseDesign as default,DatabaseStorage,DatabaseAction,DatabaseResult}