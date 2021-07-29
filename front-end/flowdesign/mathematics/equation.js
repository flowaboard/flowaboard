import { Design, DesignElement, FlowDesigns,Process,Input } from '../design.js';


var equationDesign = new FlowDesigns.ListDesign('Equations', 'equation', `https://en.wikipedia.org/wiki/Equation`)
equationDesign.add(new DesignElement('Algebraic equations', 'Algebraic_equation', `https://en.wikipedia.org/wiki/Algebraic_equation`))
equationDesign.add(new DesignElement('Functional equation', 'Functional_equation',`https://en.wikipedia.org/wiki/Functional_equation`))

equationDesign.flowConfig = {
    defaultValue: {
        widthfactor: equationDesign.designElements.length,
        xPadding: 0.4,
        yPadding: 0.4,
    },
    action: {
        "click":"flow"
    }
}

export default equationDesign;