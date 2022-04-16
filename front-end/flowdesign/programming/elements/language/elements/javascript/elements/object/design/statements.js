import Javascript from '../../../design/javascript.js';
import {JSInput,JSBody,JSOutput, JSStep} from '../../../design/javascriptElements.js';
import { DesignElement, FlowDesigns, Process, Input, Output ,Step } from '/flowdesign/design.js';
class JSStatementsDesign extends FlowDesigns.SerialDesign {
    static debug=true;
    constructor(statements,description){
        super(statements,statements,description)
        this.statements=statements
    }
    get value(){
        return this.statements
    }
    fromAst(ast){
        this.ast=ast
        this.debugger.log(ast)  
        switch (ast.type) {
            case "VariableDeclaration":
                ast.declarations.forEach(declaration=>{
                    let jsDesign = Javascript.nodeToDesign(declaration,this)
                    var jsStep = new JSStep(jsDesign.label,jsDesign.id);
                    jsStep.design=jsDesign
                    this.add(jsStep);

                })
                break;
            case "ClassBody":
            case "BlockStatement":
                ast.body.map(node => {
                    let jsStepDesign = Javascript.nodeToDesign(node, this)
                    var jsStep = new JSStep(jsStepDesign.label, jsStepDesign.id);
                    jsStep.design = jsStepDesign
                    this.add(jsStep)
                })
                break;


                
        }
    }



}
class JSStatementsBody extends JSBody {
    constructor(label, id, description, design, config,inputIdentifiers, outputIdentifiers) {
        super(label, id, description, null, config,inputIdentifiers, outputIdentifiers)
        this.design=design
    }
}
class JSStatementsInput extends JSInput {
    constructor(label, id, description, processIdentifiers, design,config) {
        super(label, id, description,processIdentifiers, null,config)
        this.design=design
    }
}
class JSStatementsOutput extends JSOutput {
    constructor(label, id, description, processIdentifiers, design, config) {
        super(label, id, description, processIdentifiers, null, config)
        this.design=design
    }
}


export { JSStatementsDesign as default, JSStatementsBody, JSStatementsInput, JSStatementsOutput }