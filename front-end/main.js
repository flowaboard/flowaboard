



import FlowAboard from './flowaboard.js'
import {DesignElement} from './flowdesign/design.js'




const parent = document.body;
const flowly =  new FlowAboard(parent)
const design = await DesignElement.loadDesign(location.href + '/front-end/flowdesign/abstract.js')

const flow = await flowly.load(design)
parent.appendChild(flow)







