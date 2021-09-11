import Javascript,{JSInput,JSBody,JSOutput} from '../../../design/javascript.js';
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
        ast.declarations.forEach(declaration=>{
            let jsDesign = Javascript.nodeToDesign(declaration,this)
            var jsStatementStep = new JSStatementStep(jsDesign.label,jsDesign.id);
            jsStatementStep.design=jsDesign
            this.add(jsStatementStep);

        })
        
    }



}
class JSStatementsBody extends Process {
    constructor(label, id, description, design, config,inputIdentifiers, outputIdentifiers) {
        super(label, id, description, null, config,inputIdentifiers, outputIdentifiers)
        this.design=design
    }
}
class JSStatementsInput extends Input {
    constructor(label, id, description, processIdentifiers, design,config) {
        super(label, id, description,processIdentifiers, null,config)
        this.design=design
    }
}
class JSStatementsOutput extends Output {
    constructor(label, id, description, processIdentifiers, design, config) {
        super(label, id, description, processIdentifiers, null, config)
        this.design=design
    }
}

class JSStatementStep extends Step{
    constructor(label,id,description, design ,inputIdentifiers, outputIdentifiers){
        var config = 
        super(label,id,description, null, config,inputIdentifiers, outputIdentifiers)
        this.design = design

    }
}



export { JSStatementsDesign as default, JSStatementsBody, JSStatementsInput, JSStatementsOutput }