import Javascript from '../../../design/javascript.js';
import {JSInput,JSBody,JSOutput} from '../../../design/javascriptElements.js';
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
        switch (ast.type) {
            case "RegExpLiteral":
                {
                    let literalValue = ast.extra.raw;
                    this.id = literalValue;
                    this.label = literalValue
                    this.add(new JSLiteralInput(literalValue,literalValue+'i','',[literalValue+'p']))
                    this.add(new JSLiteralBody(literalValue,literalValue+'p'))
                    this.add(new JSLiteralOutput(literalValue,literalValue+'o','',[literalValue+'p']))
                }
                break;
            case "NullLiteral":
                {
                    let literalValue = 'null';
                    this.id = literalValue;
                    this.label = literalValue
                    this.add(new JSLiteralInput(literalValue,literalValue+'i','',[literalValue+'p']))
                    this.add(new JSLiteralBody(literalValue,literalValue+'p'))
                    this.add(new JSLiteralOutput(literalValue,literalValue+'o','',[literalValue+'p']))
                }
                break;
        
            default:
                
                {
                    let literalValue = ast.value;
                    this.add(new JSLiteralInput(literalValue,literalValue+'i','',[literalValue+'p']))
                    this.add(new JSLiteralBody(literalValue,literalValue+'p'))
                    this.add(new JSLiteralOutput(literalValue,literalValue+'o','',[literalValue+'p']))
                }
                break;
        }
        
    }



}
class JSLiteralBody extends Process {

}
class JSLiteralInput extends Input {

}
class JSLiteralOutput extends Output {

}



export { JSLiteralDesign as default, JSLiteralBody, JSLiteralInput, JSLiteralOutput }