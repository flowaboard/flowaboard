import { DesignElement, FlowDesigns, Process, Input, Output } from '/flowdesign/design.js';

import 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js'



import MathJaxView from '../../../ui/mathJaxView.js'
import MathJaxEditor from '../../../ui/mathJaxEditor.js';


class FunctionDesign extends FlowDesigns.ProcessDesign {
    getDOM(xmlstring) {
        const parser = new DOMParser();
        return parser.parseFromString(xmlstring, "text/xml");
    }

    remove_tags(node) {
        var result = "";
        var nodes = node.childNodes;
        var tagName = node.tagName;
        if (!nodes.length) {
            if (node.nodeValue == "π") result = "pi";
            else if (node.nodeValue == " ") result = "";
            else result = node.nodeValue;
        } else if (tagName == "mfrac") {
            result = "(" + this.remove_tags(nodes[0]) + ")/(" + this.remove_tags(nodes[1]) + ")";
        } else if (tagName == "msup") {
            result = "Math.pow((" + this.remove_tags(nodes[0]) + "),(" + this.remove_tags(nodes[1]) + "))";
        } else for (var i = 0; i < nodes.length; ++i) {
            result += this.remove_tags(nodes[i]);
        }

        if (tagName == "mfenced") result = "(" + result + ")";
        if (tagName == "msqrt") result = "Math.sqrt(" + result + ")";

        return result;
    }

    parseMathML(node) {
        var variables = [], constants = [], tokens = [];
        var nodes = node.childNodes;
        var tagName = node.tagName;
        if (!nodes.length && node.nodeValue) {
            if (node.nodeValue == "π") tokens = [...tokens, "pi"];
            else if (node.nodeValue == " ") tokens = [...tokens];
            else {
                tokens = [...tokens, node.nodeValue];
                if (node.nodeValue.match(/[x-z]/))
                    variables = [...variables, node.nodeValue];
                if (node.nodeValue.match(/[a-w]/))
                    constants = [...constants, node.nodeValue];
            }
        } else if (tagName == "mfrac") {
            tokens = [...tokens, ...this.parseMathML(nodes[0]).tokens, ...this.parseMathML(nodes[1]).tokens];
            variables = [...variables, ...this.parseMathML(nodes[0]).variables, ...this.parseMathML(nodes[1]).variables];
            constants = [...constants, ...this.parseMathML(nodes[0]).constants, ...this.parseMathML(nodes[1]).constants];
        } else if (tagName == "msup") {
            tokens = [...tokens, ...this.parseMathML(nodes[0]).tokens, ...this.parseMathML(nodes[1]).tokens];
            variables = [...variables, ...this.parseMathML(nodes[0]).variables, ...this.parseMathML(nodes[1]).variables];
            tokens = [...constants, ...this.parseMathML(nodes[0]).constants, ...this.parseMathML(nodes[1]).constants];
        } else for (var i = 0; i < nodes.length; ++i) {
            tokens = [...tokens, ...this.parseMathML(nodes[i]).tokens];
            variables = [...variables, ...this.parseMathML(nodes[i]).variables];
            constants = [...constants, ...this.parseMathML(nodes[i]).constants];
        }


        return { variables, constants, tokens };
    }

    stringifyMathML(mml) {
        const xmlDoc = this.getDOM(mml);
        return this.parseMathML(xmlDoc.documentElement);
    }

    download(flow, action) {

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this, undefined, 2));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", this.id + ".flow");
        flow.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

    }
    fromJSON(json) {
        var parsed = JSON.parse(json)
        this.label = parsed.label;
        this.id = parsed.id;
        this.description = parsed.description;
        this.config = parsed.config
        this.mathml = parsed.mathml
    }
    execute() {
        this.debugger.log("Executing", JSON.stringify(this))
    }
    toJavaScript() {

    }
    toJSON(key) {

        return {
            label: this.label,
            id: this.id,
            description: this.description,
            mathml: this.mathml
        };
    }

    async processesMathMlOrTex() {
        let mathml = this.mathml || await MathJax.tex2mmlPromise(this.tex).catch(v => '')
        var ast = mathml ? this.stringifyMathML(mathml) : { constants: [], variables: [] };
        ast.variables.forEach(constant => {
            this.add(new FunctionInput(constant, constant, 'https://en.wikipedia.org/wiki/Dependent_and_independent_variables', ['function'], null,
                {
                    widthPercentage: 10,
                    heightPercentage: 10,
                    xPaddingPercentage: 100,
                    yPaddingPercentage: 50
                }))
        });

        ast.constants.forEach(variable => {
            this.add(new FunctionInput(variable, variable, 'https://en.wikipedia.org/wiki/Dependent_and_independent_variables', ['function'], null,
                {
                    widthPercentage: 10,
                    heightPercentage: 10,
                    xPaddingPercentage: 100,
                    yPaddingPercentage: 50
                }))
        });

        if (ast.constants.length > 0 || ast.variables.length > 0) {
            this.add(new FunctionOutput('y', 'y', 'https://en.wikipedia.org/wiki/Dependent_and_independent_variables', ['function'], null,
                {
                    widthPercentage: 10,
                    heightPercentage: 10,
                    xPaddingPercentage: 100,
                    yPaddingPercentage: 10
                })
            )
        }

        this.add(new FunctionBody('Function', 'function', 'A process or a relation that converts input into output', null,
            {
                widthPercentage: 20,
                heightPercentage: 10,
                xPaddingPercentage: 40,
                yPaddingPercentage: 10,

            })
        )
        if (this.mathml || this.tex) {
            this.flowConfig.elementAction = {
                "click": { "action": "active", "state": "default" },
                "loaded": ""
            }
        }
        this.publish('change')
    }
    set mathml(value) {
        this._mathml = value;
        this.processesMathMlOrTex()
    }
    get mathml() {
        return this._mathml || ''
    }
    set tex(value) {
        this._tex = value;
        this.processesMathMlOrTex()
    }
    get tex() {
        return this._tex || ''
    }

}
class FunctionBody extends Process {
    getDefaultUi() {
        var mathJaxView = MathJaxView.getNewInstance();
        mathJaxView.value = this.parent.mathml

        return mathJaxView;
    }

    getActiveUi() {
        var mathJaxEditor = document.createElement(MathJaxEditor.tag);

        mathJaxEditor.value = this.parent.mathml
        mathJaxEditor.addEventListener('change', (e) => { this.handleValueChange(e) })

        return mathJaxEditor;
    }




    async getUi(status, parent) {
        switch (status) {
            case 'active':
                return await this.getActiveUi(parent)
                break;

            default:
                return this.getDefaultUi()
                break;
        }
    }

    handleValueChange(e) {
        this.debugger.log(e.target.value);
        this.parent.mathml = e.target.value.trim()
    }
}
class FunctionInput extends Input {

}
class FunctionOutput extends Output {

}


export default FunctionDesign
