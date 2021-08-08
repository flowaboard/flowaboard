import { DesignElement, FlowDesigns, Process, Input, Output } from '../design.js';
import FlowAboard from '../../flowaboard.js'

import 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js'



import MathJaxView from './ui/mathJaxView.js'
import MathJaxEditor from './ui/mathJaxEditor.js';

import esprima from '../../lib/esprima/esprima.js'//'https://cdn.jsdelivr.net/npm/esprima@4.0.1/dist/esprima.min.js'




class FunctionDesign extends FlowDesigns.IODesign {
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
        console.log("Executing", JSON.stringify(this))
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

        console.log(esprima)
        return mathJaxView;
    }

    getActiveUi() {
        var mathJaxEditor = document.createElement(MathJaxEditor.tag);

        mathJaxEditor.value = this.parent.mathml
        mathJaxEditor.addEventListener('change', (e) => { this.handleValueChange(e) })
        console.log(esprima)
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
        console.log(e.target.value);
        this.parent.mathml = e.target.value.trim()
    }
}
class FunctionInput extends Input {

}
class FunctionOutput extends Output {

}

class FunctionListElement extends DesignElement {

    static getRootDomain() {
        return location.href.indexOf("flowaboard.github.io") >= 0 ? location.href + '/flowabaord/frontend/' : location.href
    }
    async toDesign() {
        var flow, functionDesign = new FunctionDesign(), elementAction;
        try {
            flow = await (await fetch(FunctionListElement.getRootDomain() + '/flowdesign/mathematics/functions/' + this.id + '.flow')).text()
            console.log(flow)
            functionDesign.fromJSON(flow)
            elementAction = {
                "click": { "action": "active", "state": "default" }
            }
        } catch (error) {
            functionDesign.fromJSON(JSON.stringify(this))
            elementAction = {
                "loaded": { "action": "active", "state": "default" }
            }
        }

        functionDesign.flowConfig = {
            elementAction,
            flowAction: {
                "buttons": [
                    { label: "Execute", icon: "", id: 'execute', handler: functionDesign.execute },
                    { label: "Download", icon: "", id: 'dl', handler: functionDesign.download }
                ]
            },
        }


        return functionDesign;
    }
}

var functionListDesign = new FlowDesigns.ListDesign('List of Functions', 'List_of_functions', `https://en.wikipedia.org/wiki/List_of_mathematical_functions`, 'function', '/')
functionListDesign.add(new FunctionListElement('Addition', 'Addition', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Addition'));
functionListDesign.add(new FunctionListElement('Subtraction', 'Subtraction', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Subtraction'));
functionListDesign.add(new FunctionListElement('Multiplication', 'Multiplication', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Multiplication'));
functionListDesign.add(new FunctionListElement('Division (mathematics)', 'Division_(mathematics)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Division_(mathematics)'));
functionListDesign.add(new FunctionListElement('Variable', 'Variable_(mathematics)', 'https://en.wikipedia.org/wiki/Variable_(mathematics)'));
functionListDesign.add(new FunctionListElement('Polynomials', 'Polynomial', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Polynomial'));
functionListDesign.add(new FunctionListElement('Constant function', 'Constant_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Constant_function'));
functionListDesign.add(new FunctionListElement('Linear function', 'Linear_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Linear_function'));
// functionListDesign.add(new FunctionListElement('Quadratic function', 'Quadratic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Quadratic_function'));
// functionListDesign.add(new FunctionListElement('parabola', 'Parabola', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Parabola'));
// functionListDesign.add(new FunctionListElement('Cubic function', 'Cubic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cubic_function'));
// functionListDesign.add(new FunctionListElement('Quartic function', 'Quartic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Quartic_function'));
// functionListDesign.add(new FunctionListElement('Quintic function', 'Quintic_equation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Quintic_equation'));
// functionListDesign.add(new FunctionListElement('Sextic function', 'Sextic_equation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sextic_equation'));
// functionListDesign.add(new FunctionListElement('Rational functions', 'Rational_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Rational_function'));
// functionListDesign.add(new FunctionListElement('nth root', 'Nth_root', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Nth_root'));
// functionListDesign.add(new FunctionListElement('Square root', 'Square_root', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Square_root'));
// functionListDesign.add(new FunctionListElement('Cube root', 'Cube_root', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cube_root'));
// functionListDesign.add(new FunctionListElement('Exponential function', 'Exponential_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Exponential_function'));
// functionListDesign.add(new FunctionListElement('Hyperbolic functions', 'Hyperbolic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hyperbolic_function'));
// //functionListDesign.add(new FunctionListElement('Logarithms', 'Logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Logarithm'));
// functionListDesign.add(new FunctionListElement('Natural logarithm', 'Natural_logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Natural_logarithm'));
// functionListDesign.add(new FunctionListElement('Common logarithm', 'Common_logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Common_logarithm'));
// functionListDesign.add(new FunctionListElement('Binary logarithm', 'Binary_logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Binary_logarithm'));
// functionListDesign.add(new FunctionListElement('Power functions', 'Exponentiation#Power_functions', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Exponentiation#Power_functions'));
// functionListDesign.add(new FunctionListElement('Allometric functions', 'Allometric_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Allometric_function'));
// functionListDesign.add(new FunctionListElement('Periodic functions', 'Periodic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Periodic_function'));
// //functionListDesign.add(new FunctionListElement('Trigonometric functions', 'Trigonometric_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Trigonometric_function'));
// functionListDesign.add(new FunctionListElement('sine', 'Sine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sine'));
// functionListDesign.add(new FunctionListElement('cosine', 'Cosine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cosine'));
// functionListDesign.add(new FunctionListElement('tangent', 'Tangent_(trigonometry)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Tangent_(trigonometry)'));
// functionListDesign.add(new FunctionListElement('cotangent', 'Cotangent', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cotangent'));
// functionListDesign.add(new FunctionListElement('secant', 'Secant_(trigonometry)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Secant_(trigonometry)'));
// functionListDesign.add(new FunctionListElement('cosecant', 'Cosecant', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cosecant'));
// functionListDesign.add(new FunctionListElement('exsecant', 'Exsecant', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Exsecant'));
// functionListDesign.add(new FunctionListElement('excosecant', 'Excosecant', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Excosecant'));
// functionListDesign.add(new FunctionListElement('versine', 'Versine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Versine'));
// functionListDesign.add(new FunctionListElement('coversine', 'Coversine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Coversine'));
// functionListDesign.add(new FunctionListElement('vercosine', 'Vercosine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Vercosine'));
// functionListDesign.add(new FunctionListElement('covercosine', 'Covercosine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Covercosine'));
// functionListDesign.add(new FunctionListElement('haversine', 'Haversine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Haversine'));
// functionListDesign.add(new FunctionListElement('hacoversine', 'Hacoversine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hacoversine'));
// functionListDesign.add(new FunctionListElement('havercosine', 'Havercosine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Havercosine'));
// functionListDesign.add(new FunctionListElement('hacovercosine', 'Hacovercosine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hacovercosine'));
// functionListDesign.add(new FunctionListElement('Gudermannian function', 'Gudermannian_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Gudermannian_function'));
// functionListDesign.add(new FunctionListElement('Indicator function', 'Indicator_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Indicator_function'));
// functionListDesign.add(new FunctionListElement('Step function', 'Step_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Step_function'));
// functionListDesign.add(new FunctionListElement('linear combination', 'Linear_combination', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Linear_combination'));
// functionListDesign.add(new FunctionListElement('indicator functions', 'Indicator_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Indicator_function'));
// functionListDesign.add(new FunctionListElement('half-open intervals', 'Half-open_interval', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Half-open_interval'));
// functionListDesign.add(new FunctionListElement('Heaviside step function', 'Heaviside_step_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Heaviside_step_function'));
// functionListDesign.add(new FunctionListElement('Dirac delta function', 'Dirac_delta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirac_delta_function'));
// functionListDesign.add(new FunctionListElement('Sawtooth wave', 'Sawtooth_wave', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sawtooth_wave'));
// functionListDesign.add(new FunctionListElement('Square wave', 'Square_wave', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Square_wave'));
// functionListDesign.add(new FunctionListElement('Triangle wave', 'Triangle_wave', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Triangle_wave'));
// functionListDesign.add(new FunctionListElement('Floor function', 'Floor_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Floor_function'));
// functionListDesign.add(new FunctionListElement('Ceiling function', 'Ceiling_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Ceiling_function'));
// functionListDesign.add(new FunctionListElement('Sign function', 'Sign_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sign_function'));
// functionListDesign.add(new FunctionListElement('Absolute value', 'Absolute_value', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Absolute_value'));
// functionListDesign.add(new FunctionListElement('Sigma function', 'Divisor_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Divisor_function'));
// functionListDesign.add(new FunctionListElement('Sums', 'Summation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Summation'));
// functionListDesign.add(new FunctionListElement('powers', 'Exponentiation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Exponentiation'));
// functionListDesign.add(new FunctionListElement('divisors', 'Divisor', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Divisor'));
// functionListDesign.add(new FunctionListElement('natural number', 'Natural_number', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Natural_number'));
// functionListDesign.add(new FunctionListElement('Euler\'s totient function', 'Euler%27s_totient_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Euler%27s_totient_function'));
// functionListDesign.add(new FunctionListElement('coprime', 'Coprime', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Coprime'));
// functionListDesign.add(new FunctionListElement('Prime-counting function', 'Prime-counting_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Prime-counting_function'));
// functionListDesign.add(new FunctionListElement('primes', 'Prime_number', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Prime_number'));
// functionListDesign.add(new FunctionListElement('Partition function', 'Partition_function_(number_theory)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Partition_function_(number_theory)'));
// functionListDesign.add(new FunctionListElement('Möbius μ function', 'M%C3%B6bius_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/M%C3%B6bius_function'));
// functionListDesign.add(new FunctionListElement('Logarithmic integral function', 'Logarithmic_integral_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Logarithmic_integral_function'));
// functionListDesign.add(new FunctionListElement('prime number theorem', 'Prime_number_theorem', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Prime_number_theorem'));
// functionListDesign.add(new FunctionListElement('Exponential integral', 'Exponential_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Exponential_integral'));
// functionListDesign.add(new FunctionListElement('Trigonometric integral', 'Trigonometric_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Trigonometric_integral'));
// functionListDesign.add(new FunctionListElement('Error function', 'Error_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Error_function'));
// functionListDesign.add(new FunctionListElement('normal random variables', 'Normal_distribution', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Normal_distribution'));
// functionListDesign.add(new FunctionListElement('Fresnel integral', 'Fresnel_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Fresnel_integral'));
// functionListDesign.add(new FunctionListElement('optics', 'Optics', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Optics'));
// functionListDesign.add(new FunctionListElement('Dawson function', 'Dawson_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dawson_function'));
// functionListDesign.add(new FunctionListElement('probability', 'Probability', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Probability'));
// functionListDesign.add(new FunctionListElement('Faddeeva function', 'Faddeeva_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Faddeeva_function'));
// functionListDesign.add(new FunctionListElement('Gamma function', 'Gamma_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Gamma_function'));
// functionListDesign.add(new FunctionListElement('factorial', 'Factorial', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Factorial'));
// functionListDesign.add(new FunctionListElement('Barnes G-function', 'Barnes_G-function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Barnes_G-function'));
// functionListDesign.add(new FunctionListElement('Beta function', 'Beta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Beta_function'));
// functionListDesign.add(new FunctionListElement('binomial coefficient', 'Binomial_coefficient', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Binomial_coefficient'));
// functionListDesign.add(new FunctionListElement('Digamma function', 'Digamma_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Digamma_function'));
// functionListDesign.add(new FunctionListElement('Polygamma function', 'Polygamma_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Polygamma_function'));
// functionListDesign.add(new FunctionListElement('Incomplete beta function', 'Incomplete_beta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Incomplete_beta_function'));
// functionListDesign.add(new FunctionListElement('Incomplete gamma function', 'Incomplete_gamma_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Incomplete_gamma_function'));
// functionListDesign.add(new FunctionListElement('K-function', 'K-function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/K-function'));
// functionListDesign.add(new FunctionListElement('Multivariate gamma function', 'Multivariate_gamma_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Multivariate_gamma_function'));
// functionListDesign.add(new FunctionListElement('multivariate statistics', 'Multivariate_statistics', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Multivariate_statistics'));
// functionListDesign.add(new FunctionListElement('Student\'s t-distribution', 'Student%27s_t-distribution', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Student%27s_t-distribution'));
// functionListDesign.add(new FunctionListElement('Pi function', 'Gamma_function#Pi_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Gamma_function#Pi_function'));
// functionListDesign.add(new FunctionListElement('Elliptic integrals', 'Elliptic_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Elliptic_integral'));
// functionListDesign.add(new FunctionListElement('ellipses', 'Ellipse', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Ellipse'));
// functionListDesign.add(new FunctionListElement('quarter period', 'Quarter_period', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Quarter_period'));
// functionListDesign.add(new FunctionListElement('nome', 'Nome_(mathematics)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Nome_(mathematics)'));
// functionListDesign.add(new FunctionListElement('Carlson symmetric form', 'Carlson_symmetric_form', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Carlson_symmetric_form'));
// functionListDesign.add(new FunctionListElement('Legendre form', 'Legendre_form', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Legendre_form'));
// functionListDesign.add(new FunctionListElement('Elliptic functions', 'Elliptic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Elliptic_function'));
// functionListDesign.add(new FunctionListElement('Weierstrass\'s elliptic functions', 'Weierstrass%27s_elliptic_functions', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Weierstrass%27s_elliptic_functions'));
// functionListDesign.add(new FunctionListElement('Jacobi\'s elliptic functions', 'Jacobi%27s_elliptic_functions', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Jacobi%27s_elliptic_functions'));
// functionListDesign.add(new FunctionListElement('sine lemniscate', 'Sine_lemniscate', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sine_lemniscate'));
// functionListDesign.add(new FunctionListElement('cosine lemniscate', 'Cosine_lemniscate', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cosine_lemniscate'));
// functionListDesign.add(new FunctionListElement('Theta function', 'Theta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Theta_function'));
// functionListDesign.add(new FunctionListElement('modular forms', 'Modular_form', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Modular_form'));
// functionListDesign.add(new FunctionListElement('J-invariant', 'J-invariant', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/J-invariant'));
// functionListDesign.add(new FunctionListElement('Dedekind eta function', 'Dedekind_eta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dedekind_eta_function'));
// functionListDesign.add(new FunctionListElement('Airy function', 'Airy_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Airy_function'));
// functionListDesign.add(new FunctionListElement('Bessel functions', 'Bessel_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Bessel_function'));
// functionListDesign.add(new FunctionListElement('differential equation', 'Differential_equation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Differential_equation'));
// functionListDesign.add(new FunctionListElement('astronomy', 'Astronomy', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Astronomy'));
// functionListDesign.add(new FunctionListElement('electromagnetism', 'Electromagnetism', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Electromagnetism'));
// functionListDesign.add(new FunctionListElement('mechanics', 'Mechanics', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Mechanics'));
// functionListDesign.add(new FunctionListElement('Bessel–Clifford function', 'Bessel%E2%80%93Clifford_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Bessel%E2%80%93Clifford_function'));
// functionListDesign.add(new FunctionListElement('Kelvin functions', 'Kelvin_functions', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Kelvin_functions'));
// functionListDesign.add(new FunctionListElement('Legendre function', 'Legendre_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Legendre_function'));
// functionListDesign.add(new FunctionListElement('spherical harmonics', 'Spherical_harmonics', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Spherical_harmonics'));
// functionListDesign.add(new FunctionListElement('Scorer\'s function', 'Scorer%27s_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Scorer%27s_function'));
// functionListDesign.add(new FunctionListElement('Sinc function', 'Sinc_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sinc_function'));
// functionListDesign.add(new FunctionListElement('Hermite polynomials', 'Hermite_polynomials', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hermite_polynomials'));
// functionListDesign.add(new FunctionListElement('Laguerre polynomials', 'Laguerre_polynomials', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Laguerre_polynomials'));
// functionListDesign.add(new FunctionListElement('Chebyshev polynomials', 'Chebyshev_polynomials', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Chebyshev_polynomials'));
// functionListDesign.add(new FunctionListElement('Riemann zeta function', 'Riemann_zeta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Riemann_zeta_function'));
// functionListDesign.add(new FunctionListElement('Dirichlet series', 'Dirichlet_series', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirichlet_series'));
// functionListDesign.add(new FunctionListElement('Riemann Xi function', 'Riemann_Xi_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Riemann_Xi_function'));
// functionListDesign.add(new FunctionListElement('Dirichlet eta function', 'Dirichlet_eta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirichlet_eta_function'));
// functionListDesign.add(new FunctionListElement('Dirichlet beta function', 'Dirichlet_beta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirichlet_beta_function'));
// functionListDesign.add(new FunctionListElement('Dirichlet L-function', 'Dirichlet_L-function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirichlet_L-function'));
// functionListDesign.add(new FunctionListElement('Hurwitz zeta function', 'Hurwitz_zeta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hurwitz_zeta_function'));
// functionListDesign.add(new FunctionListElement('Legendre chi function', 'Legendre_chi_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Legendre_chi_function'));
// functionListDesign.add(new FunctionListElement('Lerch transcendent', 'Lerch_transcendent', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Lerch_transcendent'));
// functionListDesign.add(new FunctionListElement('Polylogarithm', 'Polylogarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Polylogarithm'));
// functionListDesign.add(new FunctionListElement('Incomplete polylogarithm', 'Incomplete_polylogarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Incomplete_polylogarithm'));
// functionListDesign.add(new FunctionListElement('Clausen function', 'Clausen_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Clausen_function'));
// functionListDesign.add(new FunctionListElement('Complete Fermi–Dirac integral', 'Complete_Fermi%E2%80%93Dirac_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Complete_Fermi%E2%80%93Dirac_integral'));
// functionListDesign.add(new FunctionListElement('Incomplete Fermi–Dirac integral', 'Incomplete_Fermi%E2%80%93Dirac_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Incomplete_Fermi%E2%80%93Dirac_integral'));
// functionListDesign.add(new FunctionListElement('Kummer\'s function', 'Kummer%27s_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Kummer%27s_function'));
// functionListDesign.add(new FunctionListElement('Spence\'s function', 'Spence%27s_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Spence%27s_function'));
// functionListDesign.add(new FunctionListElement('Riesz function', 'Riesz_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Riesz_function'));
// functionListDesign.add(new FunctionListElement('Hypergeometric functions', 'Hypergeometric_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hypergeometric_function'));
// functionListDesign.add(new FunctionListElement('power series', 'Power_series', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Power_series'));
// functionListDesign.add(new FunctionListElement('Confluent hypergeometric function', 'Confluent_hypergeometric_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Confluent_hypergeometric_function'));
// functionListDesign.add(new FunctionListElement('Associated Legendre functions', 'Associated_Legendre_functions', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Associated_Legendre_functions'));
// functionListDesign.add(new FunctionListElement('Meijer G-function', 'Meijer_G-function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Meijer_G-function'));
// functionListDesign.add(new FunctionListElement('Fox H-function', 'Fox_H-function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Fox_H-function'));
// functionListDesign.add(new FunctionListElement('Hyper operators', 'Hyper_operator', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hyper_operator'));
// functionListDesign.add(new FunctionListElement('Iterated logarithm', 'Iterated_logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Iterated_logarithm'));
// functionListDesign.add(new FunctionListElement('Pentation', 'Pentation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Pentation'));
// functionListDesign.add(new FunctionListElement('Super-logarithms', 'Super-logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Super-logarithm'));
// functionListDesign.add(new FunctionListElement('Super-roots', 'Super-root', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Super-root'));
// functionListDesign.add(new FunctionListElement('Tetration', 'Tetration', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Tetration'));
// functionListDesign.add(new FunctionListElement('Lambert W function', 'Lambert_W_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Lambert_W_function'));
// functionListDesign.add(new FunctionListElement('Riemann zeta function', 'Riemann_zeta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Riemann_zeta_function'));
// functionListDesign.add(new FunctionListElement('Liouville function', 'Liouville_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Liouville_function'));
// functionListDesign.add(new FunctionListElement('Von Mangoldt function', 'Von_Mangoldt_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Von_Mangoldt_function'));
// functionListDesign.add(new FunctionListElement('Modular lambda function', 'Modular_lambda_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Modular_lambda_function'));
// functionListDesign.add(new FunctionListElement('Lamé function', 'Lam%C3%A9_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Lam%C3%A9_function'));
// functionListDesign.add(new FunctionListElement('Mathieu function', 'Mathieu_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Mathieu_function'));
// functionListDesign.add(new FunctionListElement('Mittag-Leffler function', 'Mittag-Leffler_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Mittag-Leffler_function'));
// functionListDesign.add(new FunctionListElement('Painlevé transcendents', 'Painlev%C3%A9_transcendents', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Painlev%C3%A9_transcendents'));
// functionListDesign.add(new FunctionListElement('Parabolic cylinder function', 'Parabolic_cylinder_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Parabolic_cylinder_function'));
// functionListDesign.add(new FunctionListElement('Synchrotron function', 'Synchrotron_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Synchrotron_function'));
// functionListDesign.add(new FunctionListElement('Arithmetic–geometric mean', 'Arithmetic%E2%80%93geometric_mean', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Arithmetic%E2%80%93geometric_mean'));
// functionListDesign.add(new FunctionListElement('Ackermann function', 'Ackermann_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Ackermann_function'));
// functionListDesign.add(new FunctionListElement('theory of computation', 'Theory_of_computation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Theory_of_computation'));
// functionListDesign.add(new FunctionListElement('computable function', 'Computable_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Computable_function'));
// functionListDesign.add(new FunctionListElement('primitive recursive', 'Primitive_recursive_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Primitive_recursive_function'));
// functionListDesign.add(new FunctionListElement('Böttcher\'s function', 'B%C3%B6ttcher%27s_equation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/B%C3%B6ttcher%27s_equation'));
// functionListDesign.add(new FunctionListElement('Dirac delta function', 'Dirac_delta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirac_delta_function'));
// functionListDesign.add(new FunctionListElement('distribution', 'Distribution_(mathematics)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Distribution_(mathematics)'));
// functionListDesign.add(new FunctionListElement('Dirichlet function', 'Dirichlet_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirichlet_function'));
// functionListDesign.add(new FunctionListElement('indicator function', 'Indicator_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Indicator_function'));
// functionListDesign.add(new FunctionListElement('nowhere continuous', 'Nowhere_continuous', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Nowhere_continuous'));
// functionListDesign.add(new FunctionListElement('Thomae\'s function', 'Thomae%27s_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Thomae%27s_function'));
// functionListDesign.add(new FunctionListElement('Kronecker delta function', 'Kronecker_delta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Kronecker_delta_function'));
// functionListDesign.add(new FunctionListElement('Minkowski\'s question mark function', 'Minkowski%27s_question_mark_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Minkowski%27s_question_mark_function'));
// functionListDesign.add(new FunctionListElement('Weierstrass function', 'Weierstrass_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Weierstrass_function'));
// functionListDesign.add(new FunctionListElement('continuous function', 'Continuous_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Continuous_function'));
// functionListDesign.add(new FunctionListElement('differentiable', 'Differentiable_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Differentiable_function'));


functionListDesign.download = (flow, action) => {

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(functionListDesign, undefined, 2));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", functionListDesign.id + ".fl");
    flow.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

}
functionListDesign.flowConfig = {
    elementAction: {
        "click": { "action": "flow", "state": "default" }
    },
    flowAction: {
        "buttons": [
            { label: "Download", icon: "", id: 'dl', handler: functionListDesign.download }
        ]
    },
    flex: true,
    feWidthPercentage: 40,
    feHeightPercentage: 20,
    fexPaddingPercentage: 5,
    feyPaddingPercentage: 5
}



export default functionListDesign;