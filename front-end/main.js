



import FlowAboard from './flowaboard.js'

import {DesignElement} from './flowdesign/design.js'


const parent = document.body;
const flowly =  new FlowAboard(parent)
const designElement = await new DesignElement('Abstract','abstract','Abstract designs','flow-info',location.href + '/flowdesign/abstract/index.js')

const flow = await flowly.load(await designElement.toDesign())
parent.appendChild(flow)






