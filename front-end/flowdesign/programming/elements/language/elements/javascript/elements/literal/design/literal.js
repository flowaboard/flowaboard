import Javascript,{JSInput,JSBody,JSOutput} from '../../../design/javascript.js';
import { DesignElement, FlowDesigns, Process, Input, Output } from '/flowdesign/design.js';
class JSLiteralDesign extends FlowDesigns.IODesign {
    constructor(literal,description){
        super(literal,literal,description)
        this.literal=literal
    }
    get value(){
        return this.literal
    }
    fromAst(ast){
        console.log(ast)
        
        this.add(new JSLiteralInput(ast.value,ast.value+'i','',[ast.value+'p']))
        this.add(new JSLiteralBody(ast.value,ast.value+'p'))
        this.add(new JSLiteralOutput(ast.value,ast.value+'o','',[ast.value+'p']))
    }



}
class JSLiteralBody extends Process {

}
class JSLiteralInput extends Input {

}
class JSLiteralOutput extends Output {

}



export { JSLiteralDesign as default, JSLiteralBody, JSLiteralInput, JSLiteralOutput }