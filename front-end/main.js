



import FlowAboard from './flowaboard.js'

import {DesignElement} from './flowdesign/design.js'


const parent = document.body;
const flowly =  new FlowAboard(parent)
//const design =await new DesignElement().loadDesign(location.href + '/flowdesign/abstract.js')
//const design = await new DesignElement().loadDesign(location.href + '/flowdesign/mathematics/index.js')
const design = await new DesignElement().loadDesign('https://flowaboard.github.io/mathematics/index.js')

const flow = await flowly.load(design)
parent.appendChild(flow)






