import { Design, DesignElement, FlowDesigns } from '../design.js';

import MathematicsDesign from './design/mathematics.js';



var matheMaticsDesign = new MathematicsDesign('MatheMatics', 'mathematics', `https://en.wikipedia.org/wiki/Mathematics`)
matheMaticsDesign.add(new DesignElement('Functions', 'function', `https://en.wikipedia.org/wiki/Function_(mathematics)`,'flow-info','/elements/functions/index.js'))
matheMaticsDesign.add(new DesignElement('Equations', 'equation', `https://en.wikipedia.org/wiki/Equation`,'flow-info','/elements/equations/index.js'))

matheMaticsDesign.root=location.href+'flowdesign/mathematics'
matheMaticsDesign.flowConfig = {
    flex: true,
    defaultValue: {
        widthfactor: matheMaticsDesign.designElements.length,
        xPadding: 0.4,
        yPadding: 0.4,
    },
    elementAction: {
        "click" : {"action":"flow","state":"default"}
    }
}

export default matheMaticsDesign;