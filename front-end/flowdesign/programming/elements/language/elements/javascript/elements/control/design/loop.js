import Javascript from '../../../design/javascript.js';
import {JSInput,JSBody,JSOutput, JSStep} from '../../../design/javascriptElements.js';
import { DesignElement, FlowDesigns, Process, Input, Output ,Step } from '/flowdesign/design.js';
class JSLoopDesign extends FlowDesigns.IODesign {
    constructor(variable,description){
        super(variable,variable,description)
        this.variable=variable
    }
    get value(){
        return this.variable
    }
    fromAst(ast){
        this.ast=ast
        this.debugger.log(ast)  
        switch (ast.type) {
            case "ForStatement": 
                var initDesign = Javascript.nodeToDesign(ast.init||{"type":"NullLiteral"},this)                       
                var updateDesign = Javascript.nodeToDesign(ast.update||{"type":"NullLiteral"},this)                       
                var testDesign = Javascript.nodeToDesign(ast.test||{"type":"NullLiteral"},this)                       
                var forProcessDesign = Javascript.nodeToDesign(ast.body,this)                       
                this.add(new JSLoopInput(initDesign.label,initDesign.id+'truei','',[forProcessDesign.id+'true'],initDesign))
                this.add(new JSLoopBody(forProcessDesign.label,forProcessDesign.id+'true'))
                this.add(new JSLoopOutput(this.js,this.js+'trueo','',[forProcessDesign.id+'true']))
                

                break;
            default:
                break;
        }
    }



}
class JSLoopBody extends JSBody {

}
class JSLoopInput extends JSInput {

}
class JSLoopOutput extends JSOutput {

}



export { JSLoopDesign as default, JSLoopBody, JSLoopInput, JSLoopOutput }