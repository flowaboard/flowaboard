import Javascript,{JSInput,JSBody,JSOutput} from '../../../design/javascript.js';
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
        console.log(ast)
        
        this.add(new JSVariableInput(ast.value,ast.value+'i','',[ast.value+'p']))
        this.add(new JSVariableBody(ast.value,ast.value+'p'))
        this.add(new JSVariableOutput(ast.value,ast.value+'o','',[ast.value+'p']))
    }



}
class JSVariableBody extends Process {

}
class JSVariableInput extends Input {

}
class JSVariableOutput extends Output {

}



export { JSVariableDesign as default, JSVariableBody, JSVariableInput, JSVariableOutput }