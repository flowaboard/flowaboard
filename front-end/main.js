



import FlowAboard from './flowaboard.js'
import './lib/require.js'
import {DesignElement} from './flowdesign/design.js'


import esprima from './lib/esprima/esprima.js'//'https://cdn.jsdelivr.net/npm/esprima@4.0.1/dist/esprima.min.js'



const parent = document.body;
const flowly =  new FlowAboard(parent)
const design = await DesignElement.loadDesign(location.href + '/front-end/flowdesign/abstract.js')

const flow = await flowly.load(design)
parent.appendChild(flow)

console.log(esprima)





