import Javascript,{JSInput,JSBody,JSOutput} from '../../../design/javascript.js';
import { DesignElement, FlowDesigns, Process, Input, Output } from '/flowdesign/design.js';
class JSStatementDesign extends FlowDesigns.IODesign {
    static debug=true;
    constructor(statement,description){
        super(statement,statement,description)
        this.statement=statement
    }
    get value(){
        return this.statement
    }
    fromAst(ast){
        this.ast=ast
        this.debugger.log(ast)  
        switch (ast.type) {
            case "ExpressionStatement":
            case "VariableDeclaration":                
                var jsDesign = Javascript.nodeToDesign(ast.expression,this)
                this.add(new JSStatementInput('Window', 'window'+ 'i', '', [jsDesign.id + 'p']))
                this.add(new JSStatementBody(jsDesign.js, jsDesign.id + 'p','',jsDesign))
                this.add(new JSStatementOutput('Window', 'window'+ 'o', '', [jsDesign.id + 'p']))
                break;
        
            default:
                break;
        }
        
    }



}
class JSStatementBody extends Process {
    constructor(label, id, description, design, config,inputIdentifiers, outputIdentifiers) {
        super(label, id, description, null, config,inputIdentifiers, outputIdentifiers)
        this.design=design
    }
}
class JSStatementInput extends Input {
    constructor(label, id, description, processIdentifiers, design,config) {
        super(label, id, description,processIdentifiers, null,config)
        this.design=design
    }
}
class JSStatementOutput extends Output {
    constructor(label, id, description, processIdentifiers, design, config) {
        super(label, id, description, processIdentifiers, null, config)
        this.design=design
    }
}



export { JSStatementDesign as default, JSStatementBody, JSStatementInput, JSStatementOutput }