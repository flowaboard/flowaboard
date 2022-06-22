import { Design, DesignElement, FlowDesigns } from  '/flowdesign/design.js';
import { JavascriptElement } from './../../design/javascriptElements.js';

var javascriptElementsDesign = new FlowDesigns.ListDesign('Javascript Litrals', 'jsliterals', `https://en.wikipedia.org/wiki/Application_software`);

javascriptElementsDesign.add(new JavascriptElement('DirectiveLiteral', 'directiveLiteral', `https://en.wikipedia.org/wiki/User_interface`,'element-info','/elements/directiveLiteral/index.js'))
javascriptElementsDesign.add(new JavascriptElement('RegExpLiteral', 'regExpLiteral', `https://en.wikipedia.org/wiki/Server_(computing)`,'element-info','/elements/regExpLiteral/index.js'))
javascriptElementsDesign.add(new JavascriptElement('NullLiteral', 'nullLiteral', `https://en.wikipedia.org/wiki/Database`,'element-info','/elements/nullLiteral/index.js'))
javascriptElementsDesign.add(new JavascriptElement('StringLiteral', 'stringLiteral', `https://en.wikipedia.org/wiki/Web_application`,'element-info','/elements/stringLiteral/index.js'))
javascriptElementsDesign.add(new JavascriptElement('BooleanLiteral', 'booleanLiteral', `https://en.wikipedia.org/wiki/Mobile_app`,'element-info','/elements/booleanLiteral/index.js'))
javascriptElementsDesign.add(new JavascriptElement('NumericLiteral', 'numericLiteral', `https://en.wikipedia.org/wiki/Desktop_application`,'element-info','/elements/numericLiteral/index.js'))
javascriptElementsDesign.add(new JavascriptElement('BigIntLiteral', 'bigIntLiteral', `https://en.wikipedia.org/wiki/Graph_of_a_function`,'element-info','/elements/bigIntLiteral/index.js'))
javascriptElementsDesign.add(new JavascriptElement('DecimalLiteral', 'decimalLiteral', `https://en.wikipedia.org/wiki/Graph_of_a_function`,'element-info','/elements/cecimalLiteral/index.js'))

javascriptElementsDesign.root = import.meta.url.replace('/index.js','')


javascriptElementsDesign.flowConfig = {
    elementAction: {
        "click": { "action": "flow", "state": "default" }
    },
    flex: true,
    feWidthPercentage: 40,
    feHeightPercentage: 10,
    fexPaddingPercentage: 5,
    feyPaddingPercentage: 5
}


export default javascriptElementsDesign;