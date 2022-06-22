import Javascript from '../../../design/javascript.js';
import {JSInput,JSBody,JSOutput} from '../../../design/javascriptElements.js';
import { DesignElement, FlowDesigns, Process, Input, Output } from '/flowdesign/design.js';
class JSVariableDesign extends FlowDesigns.IODesign {
    constructor(variable,description){
        super(variable,variable,description)
        this.variable=variable
    }
    get value(){
        return this.variable
    }
    fromAst(ast){
        this.debugger.log(ast.type,ast)
        switch (ast.type) {
            case "Identifier":                        
                this.add(new JSVariableInput(ast.name,ast.name+'i','',[ast.name+'p']))
                this.add(new JSVariableBody(ast.name,ast.name+'p'))
                this.add(new JSVariableOutput(ast.name,ast.name+'o','',[ast.name+'p']))
                break;
            default:
                break;
        }
    }



}
class JSVariableBody extends Process {

}
class JSVariableInput extends Input {

}
class JSVariableOutput extends Output {

}



export { JSVariableDesign as default, JSVariableBody, JSVariableInput, JSVariableOutput }