import Javascript from '../../../design/javascript.js';
import {JSInput,JSBody,JSOutput, JSStep} from '../../../design/javascriptElements.js';
import { DesignElement, FlowDesigns, Process, Input, Output ,Step } from '/flowdesign/design.js';
class JSIfElseDesign extends FlowDesigns.IODesign {
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
            case "IfStatement": 
                var trueDesign = Javascript.nodeToDesign(ast.test,this)                       
                var trueProcessDesign = Javascript.nodeToDesign(ast.consequent,this)                       
                this.add(new JSIfElseInput(trueDesign.label,trueDesign.id+'truei','',[trueProcessDesign.id+'true'],trueDesign))
                this.add(new JSIfElseBody(trueProcessDesign.label,trueProcessDesign.id+'true','',trueProcessDesign))
                this.add(new JSIfElseOutput(this.js,this.js+'trueo','',[trueProcessDesign.id+'true']))

                if(ast.alternate){

                    var falseDesign = Javascript.nodeToDesign(ast.test,this)
                    var falseProcessDesign = Javascript.nodeToDesign(ast.alternate,this)   
                    this.add(new JSIfElseInput(ast.name,ast.name+'falsei','',[ast.name+'falsep'],falseDesign))
                    this.add(new JSIfElseBody(ast.name,ast.name+'falsep','',falseProcessDesign))
                    this.add(new JSIfElseOutput(ast.name,ast.name+'falseo','',[ast.name+'falsep']))
                }

                break;
            default:
                break;
        }
    }



}
class JSIfElseBody extends JSBody {

}
class JSIfElseInput extends JSInput {

}
class JSIfElseOutput extends JSOutput {

}



export { JSIfElseDesign as default, JSIfElseBody, JSIfElseInput, JSIfElseOutput }