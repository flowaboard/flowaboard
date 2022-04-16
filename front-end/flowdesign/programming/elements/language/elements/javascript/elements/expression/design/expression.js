import Javascript from '../../../design/javascript.js';
import {JSInput,JSBody,JSOutput} from '../../../design/javascriptElements.js';
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
                this.add(new JSExpressionOutput(this.js, this.js, '', [ast.operator]))
                break;
            case 'AssignmentExpression':
                var leftDesign = Javascript.nodeToDesign(ast.left,this)
                var rightDesign = Javascript.nodeToDesign(ast.right,this)
                
                this.add(new JSExpressionInput(leftDesign.label, leftDesign.id + '-i', '', [ast.operator],leftDesign))
                this.add(new JSExpressionInput(rightDesign.label, rightDesign.id + '-i', '', [ast.operator],rightDesign))
                this.add(new JSExpressionBody(ast.operator, ast.operator))
                this.add(new JSExpressionOutput(this.js, this.js, '', [ast.operator]))
                break;
            case "ClassDeclaration":
                var leftDesign = Javascript.nodeToDesign(ast.id,this)
                var rightDesign = Javascript.nodeToDesign(ast.body||{"type":"NullLiteral"},this)                
                
                this.add(new JSExpressionInput(leftDesign.label, leftDesign.id + '-i', '', ["="],leftDesign))
                this.add(new JSExpressionInput(rightDesign.label, rightDesign.id + '-i', '', ["="],rightDesign))
                this.add(new JSExpressionBody("=", "="))
                this.add(new JSExpressionOutput(this.js, this.js, '', ["="]))
                break;
            case "ClassMethod":
                var leftDesign = Javascript.nodeToDesign(ast.key,this)
                var rightDesign = Javascript.nodeToDesign(ast.body||{"type":"NullLiteral"},this)                
                
                this.add(new JSExpressionInput(leftDesign.label, leftDesign.id + '-i', '', ["="],leftDesign))
                this.add(new JSExpressionInput(rightDesign.label, rightDesign.id + '-i', '', ["="],rightDesign))
                this.add(new JSExpressionBody("=", "="))
                this.add(new JSExpressionOutput(this.js, this.js, '', ["="]))
                break;
            case 'VariableDeclarator':
                var leftDesign = Javascript.nodeToDesign(ast.id,this)
                var rightDesign = Javascript.nodeToDesign(ast.init||{"type":"NullLiteral"},this)
                
                
                this.add(new JSExpressionInput(leftDesign.label, leftDesign.id + '-i', '', ["="],leftDesign))
                this.add(new JSExpressionInput(rightDesign.label, rightDesign.id + '-i', '', ["="],rightDesign))
                this.add(new JSExpressionBody("=", "="))
                this.add(new JSExpressionOutput(this.js, this.js, '', ["="]))
                break;
            case 'MemberExpression':
                var leftDesign = Javascript.nodeToDesign(ast.object,this)
                var rightDesign = Javascript.nodeToDesign(ast.property,this)
                
                
                this.add(new JSExpressionInput(leftDesign.label, leftDesign.id + '-i', '', ["."],leftDesign))
                this.add(new JSExpressionInput(rightDesign.label, rightDesign.id + '-i', '', ["."],rightDesign))
                this.add(new JSExpressionBody(".", "."))
                this.add(new JSExpressionOutput(this.js, this.js, '', ["."]))
                break;
            case 'CallExpression':
                let processDesign = Javascript.nodeToDesign(ast.callee,this)
                ast.arguments.forEach(argument=>{
                    let argumentDesign = Javascript.nodeToDesign(argument,this)
                    this.add(new JSExpressionInput(argumentDesign.label, argumentDesign.id + '-i', '', ["function"],argumentDesign))
                })
                this.add(new JSExpressionBody("function", "function",'',processDesign))
                processDesign.outputs.forEach(output=>{
                    this.add(new JSExpressionOutput(output.label, output.id + '-o', '', ["function"]))
                })
                break;
            default:
                var leftDesign = Javascript.nodeToDesign(ast.left,this)
                var rightDesign = Javascript.nodeToDesign(ast.right,this)
                
                this.add(new JSExpressionInput(leftDesign.label, leftDesign.id + '-i', '', [ast.operator],leftDesign))
                this.add(new JSExpressionInput(rightDesign.label, rightDesign.id + '-i', '', [ast.operator],rightDesign))
                this.add(new JSExpressionBody(ast.operator, ast.operator))
                this.add(new JSExpressionOutput('Context.'+leftDesign.id, 'context.'+leftDesign.id, '', [ast.operator]))
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