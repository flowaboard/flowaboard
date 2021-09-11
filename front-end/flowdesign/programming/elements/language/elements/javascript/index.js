import { Design, DesignElement, FlowDesigns } from  '/flowdesign/design.js';
import { JavascriptElement } from './design/javascript.js';

var javascriptElementsDesign = new FlowDesigns.ListDesign('Javascript', 'js', `https://en.wikipedia.org/wiki/Application_software`);

javascriptElementsDesign.add(new JavascriptElement('Literal', 'literal', `https://en.wikipedia.org/wiki/User_interface`,'element-info','/elements/literal/index.js'))
javascriptElementsDesign.add(new JavascriptElement('Variable', 'variable', `https://en.wikipedia.org/wiki/Server_(computing)`,'element-info','/elements/variable/index.js'))
javascriptElementsDesign.add(new JavascriptElement('Loops', 'loop', `https://en.wikipedia.org/wiki/Database`,'element-info','/elements/loop/index.js'))
javascriptElementsDesign.add(new JavascriptElement('Conditional', 'conditional', `https://en.wikipedia.org/wiki/Web_application`,'element-info','/elements/conditional/index.js'))
javascriptElementsDesign.add(new JavascriptElement('Function', 'function', `https://en.wikipedia.org/wiki/Mobile_app`,'element-info','/elements/function/index.js'))
javascriptElementsDesign.add(new JavascriptElement('Container', 'object', `https://en.wikipedia.org/wiki/Desktop_application`,'element-info','/elements/object/index.js'))
javascriptElementsDesign.add(new JavascriptElement('Module', 'module', `https://en.wikipedia.org/wiki/Graph_of_a_function`,'element-info','/elements/module/index.js'))
javascriptElementsDesign.add(new JavascriptElement('Script', 'script', `https://en.wikipedia.org/wiki/Graph_of_a_function`,'element-info','/elements/script/index.js'))

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