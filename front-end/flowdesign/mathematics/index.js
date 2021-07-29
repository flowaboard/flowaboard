import { Design, DesignElement, FlowDesigns } from '../design.js';//'https://cdn.jsdelivr.net/gh/flowaboard/flowaboard/front-end/flowdesign/design.js';


var matheMaticsDesign = new FlowDesigns.ListDesign('MatheMatics', 'mathematics', `https://en.wikipedia.org/wiki/Mathematics`)
matheMaticsDesign.add(new DesignElement('Functions', 'function', `https://en.wikipedia.org/wiki/Function_(mathematics)`,'flow-info','/front-end/flowdesign/mathematics/function.js' || 'https://cdn.jsdelivr.net/gh/flowaboard/mathematics/function.js'))
matheMaticsDesign.add(new DesignElement('Equations', 'equation', `https://en.wikipedia.org/wiki/Equation`,'flow-info','/front-end/flowdesign/mathematics/equation.js' || 'https://cdn.jsdelivr.net/gh/flowaboard/mathematics/equation.js'))

matheMaticsDesign.flowConfig = {
    flex: true,
    defaultValue: {
        widthfactor: matheMaticsDesign.designElements.length,
        xPadding: 0.4,
        yPadding: 0.4,
    },
    action: {
        "click":"flow"
    }
}

export default matheMaticsDesign;