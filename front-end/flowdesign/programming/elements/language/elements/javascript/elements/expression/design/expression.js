import Javascript from '../../../design/javascript.js';
import { DesignElement, FlowDesigns, Process, Input, Output } from '/flowdesign/design.js';
class JSExpressionDesign extends FlowDesigns.ProcessDesign {
    js;
    ast;
    get debug(){
        return true;
    };
    get value() {
        return this.expression
    }

    fromAst(ast) {
        this.ast=ast
        this.debugger.log(ast)        
        switch (ast.type) {
            
                
            case 'BinaryExpression':
                var leftDesign = Javascript.nodeToDesign(ast.left,this)
                var rightDesign = Javascript.nodeToDesign(ast.right,this)

                this.add(new JSExpressionInput(leftDesign.label, leftDesign.id + '-i', '', [ast.operator],leftDesign))
                this.add(new JSExpressionInput(rightDesign.label, rightDesign.id + '-i', '', [ast.operator],rightDesign))
                this.add(new JSExpressionBody(ast.operator, ast.operator))
                this.add(new JSExpressionOutput('Output', 'ouptput', '', [ast.operator]))
                break;
            case 'AssignmentExpression':
                var leftDesign = Javascript.nodeToDesign(ast.left,this)
                var rightDesign = Javascript.nodeToDesign(ast.right,this)
                
                this.add(new JSExpressionInput(leftDesign.label, leftDesign.id + '-i', '', [ast.operator],leftDesign))
                this.add(new JSExpressionInput(rightDesign.label, rightDesign.id + '-i', '', [ast.operator],rightDesign))
                this.add(new JSExpressionBody(ast.operator, ast.operator))
                this.add(new JSExpressionOutput('Context.'+leftDesign.id, 'context.'+leftDesign.id, '', [ast.operator]))
                break;
            default:
                var jsDesign = Javascript.nodeToDesign(ast,this)
                this.add(new JSExpressionInput(jsDesign.label, jsDesign.id+ 'i', '', [ast.value + 'p'],jsDesign))
                this.add(new JSExpressionBody(jsDesign.js, jsDesign.id + 'p'))
                this.add(new JSExpressionOutput(jsDesign.label, jsDesign.id + 'o', '', [ast.value + 'p']))
                break;


        }

    }

}
class JSExpressionBody extends Process {
    constructor(label, id, description, design, config,inputIdentifiers, outputIdentifiers) {
        super(label, id, description, null, config,inputIdentifiers, outputIdentifiers)
        this.design=design
    }
}
class JSExpressionInput extends Input {
    constructor(label, id, description, processIdentifiers, design,config) {
        super(label, id, description,processIdentifiers, null,config)
        this.design=design
    }
}
class JSExpressionOutput extends Output {
    constructor(label, id, description, processIdentifiers, design, config) {
        super(label, id, description, processIdentifiers, null, config)
        this.design=design
    }
}



export { JSExpressionDesign as default, JSExpressionBody, JSExpressionInput, JSExpressionOutput }