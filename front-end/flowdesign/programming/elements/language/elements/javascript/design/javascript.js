import { DesignElement, FlowDesigns, Process, Input, Output, Step } from '/flowdesign/design.js';




import esprima from '/lib/esprima/esprima.js'//'https://cdn.jsdelivr.net/npm/esprima@4.0.1/dist/esprima.min.js'

import 'https://unpkg.com/@babel/standalone/babel.js'

import * as babelparser from '/lib/babelparser/lib/index.min.js'//'https://unpkg.com/@babel/parser@7.15.3/lib/index.js'

import JSLiteralDesign from '../elements/literal/design/literal.js';
import JSExpressionDesign from '../elements/expression/design/expression.js';
import JSVariableDesign from '../elements/variable/design/variable.js';
import JSStatementDesign from '../elements/object/design/statement.js';
import JSStatementsDesign from '../elements/object/design/statements.js';

class JSStep extends Step {
    constructor(label, id, description, design, inputIdentifiers, outputIdentifiers) {
        var config =
            super(label, id, description, null, config, inputIdentifiers, outputIdentifiers)
        this.design = design

    }
}

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
        this.debugger.log(ast)

        this.directiveTodesign(ast.program.directives)
        this.bodyToDesign(ast.program.body)

        this.addInput(new JSInput('Window', 'window', '', [this.firstStep.id]))
        // this.addInput(new JSInput('Window.dom','window.dom','',[this.firstStep.id]))
        // this.addInput(new JSInput('Window.Network','window.network','',[this.firstStep.id]))
        // this.addInput(new JSInput('Window.Storage','window.storage','',[this.firstStep.id]))

        this.addOutput(new JSOutput('Window', 'window2', '', [this.lastStep.id]))
        // this.addOutput(new JSOutput('Window.dom','window.dom2','',[this.lastStep.id]))
        // this.addOutput(new JSOutput('Window.Network','window.network2','',[this.lastStep.id]))
        // this.addOutput(new JSOutput('Window.Storage','window.storage2','',[this.lastStep.id]))

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
            case "VariableDeclarator":
                return Javascript.variableToDesign(node, parentDesign)
            case "ExpressionStatement":
                return Javascript.statementToDesign(node, parentDesign)
            case "VariableDeclaration":
                return Javascript.variableDeclarationToDesign(node, parentDesign)
            case "BinaryExpression":
            case "AssignmentExpression":
                return Javascript.expressionToDesign(node, parentDesign)
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
        statementJS.fromAst(statement)
        statementJS.flowConfig = {
            elementAction: {
                "click": { "action": "flow", "state": "default" }
            },

        }
        return statementJS;
    }
    static variableDeclarationToDesign(variableDeclation, parentDesign) {
        const variableDeclarationJS = new JSStatementsDesign(variableDeclation.loc.text, variableDeclation.loc.id)
        variableDeclarationJS.js = variableDeclation.loc.text
        variableDeclarationJS.fromAst(variableDeclation)
        variableDeclarationJS.addInput(parentDesign)
        variableDeclarationJS.flowConfig = {
            elementAction: {
                "click": { "action": "flow", "state": "default" }
            },

        }
        return variableDeclarationJS;
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
    static updateLoc(node, parentnode, js) {
        let relativeStart = node.start - parentnode.start;
        let relativeEnd = node.end - parentnode.start;
        node.loc.text = js.substring(relativeStart, relativeEnd);
        node.loc.id = node.start + '->' + js.substring(node.start, node.end) + '->' + node.end;
    }
    directiveTodesign(directives) {
        directives.map(directive => {
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
    bodyToDesign(nodes) {
        nodes.map(node => {
            let jsStepDesign = Javascript.nodeToDesign(node, this)
            var jsStep = new JSStep(jsStepDesign.label, jsStepDesign.id);
            jsStep.design = jsStepDesign
            this.add(jsStep)
        })
    }

}
export class JSBody extends Process {

}
export class JSInput extends Input {

}
export class JSOutput extends Output {

}
export default Javascript;


export class JavascriptElement extends DesignElement {

}