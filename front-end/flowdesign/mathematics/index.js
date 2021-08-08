import { Design, DesignElement, FlowDesigns } from '../design.js';

class MathematicsDesign extends FlowDesigns.ListDesign{
    static getRootDomain(){
        return location.href.indexOf("flowaboard.github.io")>=0?location.href+'/flowabaord/front-end/flowdesign/mathematics':location.href+'/front-end/flowdesign/mathematics'
    }
}



var matheMaticsDesign = new MathematicsDesign('MatheMatics', 'mathematics', `https://en.wikipedia.org/wiki/Mathematics`)
matheMaticsDesign.add(new DesignElement('Functions', 'function', `https://en.wikipedia.org/wiki/Function_(mathematics)`,'flow-info','/functiondesign.js'))
matheMaticsDesign.add(new DesignElement('Equations', 'equation', `https://en.wikipedia.org/wiki/Equation`,'flow-info','/equationdesign.js'))

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