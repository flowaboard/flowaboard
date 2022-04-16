import Javascript from '../../../design/javascript.js';
import { JSInput, JSBody, JSOutput } from '../../../design/javascriptElements.js';
import { DesignElement, FlowDesigns } from '/flowdesign/design.js';
class JSStatementDesign extends FlowDesigns.IODesign {
    static debug = true;
    constructor(statement, description) {
        super(statement, statement, description)
        this.statement = statement
    }
    get value() {
        return this.statement
    }
    fromAst(ast) {
        this.ast = ast
        this.debugger.log(ast)
        switch (ast.type) {
            case "ExpressionStatement":
            case "VariableDeclaration":
                var jsDesign = Javascript.nodeToDesign(ast.expression, this)
                this.add(new JSStatementBody(jsDesign.js, jsDesign.id + 'p', '', jsDesign, null, this.inputs.map(v => v.id), this.outputs.map(v => v.id)))
                break;

            default:
                break;
        }

    }



}
class JSStatementBody extends JSBody {

}
class JSStatementInput extends JSInput {

}
class JSStatementOutput extends JSOutput {

}



export { JSStatementDesign as default, JSStatementBody, JSStatementInput, JSStatementOutput }