import { Design, DesignElement, FlowDesigns,Process,Input } from '/flowdesign/design.js';

import EquationsDesign from './design/equations.js'


var equationDesign = new EquationsDesign('Equations', 'equation', `https://en.wikipedia.org/wiki/Equation`)
equationDesign.add(new DesignElement('Algebraic equations', 'Algebraic_equation', `https://en.wikipedia.org/wiki/Algebraic_equation`))
equationDesign.add(new DesignElement('Functional equation', 'Functional_equation',`https://en.wikipedia.org/wiki/Functional_equation`))

equationDesign.flowConfig = {
    defaultValue: {
        widthfactor: equationDesign.designElements.length,
        xPadding: 0.4,
        yPadding: 0.4,
    },
    elementAction: {
        "click" : {"action":"flow","state":"default"}
    }
}

export default equationDesign;