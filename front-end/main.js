



import FlowAboard from './flowaboard.js'

import { DesignElement } from './flowdesign/design.js'


const parent = document.body.querySelector('.content');
const flowly = new FlowAboard(parent)
var paths = location.pathname.split('/')
let currentDesignElement, currentDesign;
for (const path of paths) {
    if (path == '') {
        currentDesignElement = await new DesignElement('Abstract', 'abstract', 'Abstract designs', 'flow-info', location.origin + '/flowdesign/abstract/index.js')
        currentDesign = await currentDesignElement.toDesign()
    } else {
        currentDesignElement = currentDesign.getElement(path)
        currentDesign = await currentDesignElement.toDesign()
    }

}


const flow = await flowly.load(currentDesign)
parent.appendChild(flow)






