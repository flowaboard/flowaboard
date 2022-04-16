import { DesignElement, FlowDesigns, Process, Input, Output, Step } from '/flowdesign/design.js';
import { JSStep, JSBody, JSInput, JSOutput } from './javascriptElements.js';




import esprima from '/lib/esprima/esprima.js'//'https://cdn.jsdelivr.net/npm/esprima@4.0.1/dist/esprima.min.js'

import 'https://unpkg.com/@babel/standalone/babel.js'

import * as babelparser from '/lib/babelparser/lib/index.min.js'//'https://unpkg.com/@babel/parser@7.15.3/lib/index.js'

import JSLiteralDesign from '../elements/literal/design/literal.js';
import JSExpressionDesign from '../elements/expression/design/expression.js';
import JSVariableDesign from '../elements/variable/design/variable.js';
import JSStatementDesign from '../elements/object/design/statement.js';
import JSStatementsDesign from '../elements/object/design/statements.js';
import JSIfElseDesign from '../elements/control/design/ifelse.js';
import JSLoopDesign from '../elements/control/design/loop.js';


class Javascript extends FlowDesigns.SerialDesign {
    static debug = true;
    js;
    ast;
    execute(...params) {
        return (new Function('start', 'end', this.toJS()))(...params)
    }
    toJS() {
        return this.js
    }
    toAst() {
        return this.js
    }
    fromJS(js) {
        this.js = js;

        // this.js= await (await (await fetch('/flowdesign/design.js')).text());

        this.ast = babelparser.parse(this.js, {
            // parse in strict mode and allow module declarations
            sourceType: "module",

            plugins: [
                // enable jsx and flow syntax
                "jsx",
                "flow",
            ],
        })

        this.fromAst(this.ast)

    }
    fromAst(ast) {
        this.addInput(new JSInput('Window', 'window', ''))

        this.addOutput(new JSOutput('Window', 'window2', '',))

        this.debugger.log(ast)

        this.directiveTodesign(ast.program)
        this.bodyToDesign(ast.program)


    }
    static nodeToDesign(node, parentDesign) {
        var parentNode = parentDesign.ast
        var js = parentDesign.js
        Javascript.updateLoc(node, parentNode, js)
        switch (node.type) {
            case "DirectiveLiteral":
            case "NumericLiteral":
            case "StringLiteral":
            case "BooleanLiteral":
            case "DecimalLiteral":
            case "BigIntLiteral":
            case "NullLiteral":
            case "RegExpLiteral":
                return Javascript.literalToDesign(node, parentDesign)
            case "Identifier":                   
                return Javascript.variableToDesign(node, parentDesign)
            case "ExpressionStatement":
                return Javascript.statementToDesign(node, parentDesign)
            case "VariableDeclaration":
            case "ClassBody":
            case "BlockStatement":
                return Javascript.declarationToDesign(node, parentDesign)
            case "BinaryExpression":
            case "AssignmentExpression":
            case "VariableDeclarator":
            case "ClassDeclaration":            
            case "ClassMethod":     
            case "CallExpression":     
            case "MemberExpression":     
                return Javascript.expressionToDesign(node, parentDesign)
            case "IfStatement":     
                return Javascript.ifelseToDesign(node, parentDesign)
            case "ForStatement":     
                return Javascript.loopToDesign(node, parentDesign)
            default:
                break;
        }
    }
    static literalToDesign(literal, parentDesign) {

        const literalJs = new JSLiteralDesign(literal.value, literal.value)
        literalJs.js = literal.loc.text
        literalJs.fromAst(literal)
        literalJs.flowConfig = {
            elementAction: {
                "click": { "action": "flow", "state": "default" }
            },

        }
        return literalJs;
    }
    static variableToDesign(variable, parentDesign) {

        const variableJs = new JSVariableDesign(variable.name, variable.name)
        variableJs.js = variable.loc.text
        variableJs.fromAst(variable)
        variableJs.flowConfig = {
            elementAction: {
                "click": { "action": "flow", "state": "default" }
            },

        }
        return variableJs;
    }
    static statementToDesign(statement, parentDesign) {

        const statementJS = new JSStatementDesign(statement.loc.text, statement.loc.id)
        statementJS.js = statement.loc.text
        parentDesign.inputs.forEach(input => statementJS.add(input))
        parentDesign.outputs.forEach(output => statementJS.add(output))
        statementJS.fromAst(statement)
        statementJS.flowConfig = {
            elementAction: {
                "click": { "action": "flow", "state": "default" }
            },

        }
        return statementJS;
    }
    static declarationToDesign(declaration, parentDesign) {
        const declarationJS = new JSStatementsDesign(declaration.loc.text, declaration.loc.id)
        declarationJS.js = declaration.loc.text
        parentDesign.inputs.forEach(input => declarationJS.addInput(input))
        parentDesign.outputs.forEach(output => declarationJS.add(output))
        declarationJS.fromAst(declaration)

        declarationJS.flowConfig = {
            elementAction: {
                "click": { "action": "flow", "state": "default" }
            },

        }
        return declarationJS;
    }
    static expressionToDesign(expression, parentDesign) {

        const expressionJS = new JSExpressionDesign(expression.loc.text, expression.loc.id)
        expressionJS.js = expression.loc.text
        expressionJS.fromAst(expression)
        expressionJS.flowConfig = {
            elementAction: {
                "click": { "action": "flow", "state": "default" }
            },

        }
        return expressionJS;
    }
    static ifelseToDesign(expression, parentDesign) {

        const ifelseJS = new JSIfElseDesign(expression.loc.text, expression.loc.id)
        ifelseJS.js = expression.loc.text
        ifelseJS.fromAst(expression)
        ifelseJS.flowConfig = {
            elementAction: {
                "click": { "action": "flow", "state": "default" }
            },

        }
        return ifelseJS;
    }
    static loopToDesign(expression, parentDesign) {

        const loopJS = new JSLoopDesign(expression.loc.text, expression.loc.id)
        loopJS.js = expression.loc.text
        loopJS.fromAst(expression)
        loopJS.flowConfig = {
            elementAction: {
                "click": { "action": "flow", "state": "default" }
            },

        }
        return loopJS;
    }

    static updateLoc(node, parentnode, js) {
        if(!node.loc){
            node.loc={
                
            }
            return 
        }
        let relativeStart = node.start - parentnode.start;
        let relativeEnd = node.end - parentnode.start;
        let nodeJs = js.substring(relativeStart, relativeEnd)
        node.loc.text = nodeJs;
        node.loc.id = node.start + '->' + nodeJs + '->' + node.end;
    }
    directiveTodesign(ast) {
        ast.directives.map(directive => {
            switch (directive.value.type) {
                case "DirectiveLiteral":
                    switch (directive.value.value) {
                        case "use strict":
                            {
                                let literalJs = Javascript.nodeToDesign(directive.value, this)
                                var jsStep = new JSStep(literalJs.label, literal.id);
                                jsStep.design = literalJs
                                this.add(jsStep)
                            }
                            break;

                        default:
                            {
                                let literalJs = Javascript.nodeToDesign(directive.value, this)
                                var jsStep = new JSStep(literalJs.label, literal.id);
                                jsStep.design = literalJs
                                this.add(jsStep)
                            }
                            break;
                    }
                    break;

                default:
                    break;
            }
        })
    }
    bodyToDesign(ast) {
        ast.body.map(node => {
            let jsStepDesign = Javascript.nodeToDesign(node, this)
            var jsStep = new JSStep(jsStepDesign.label, jsStepDesign.id);
            jsStep.design = jsStepDesign
            this.add(jsStep)
        })
    }

}

export default Javascript;


