



import FlowAboard from './flowaboard.js'

import { DesignElement } from './flowdesign/design.js'

import Debugger from './lib/debugger.js';

Debugger.debugs={
    'el-ui-board':true,
    'el-ui-flow':true,
}

const abstractContent = document.body.querySelector('.content');
const flowly = new FlowAboard(abstractContent)
var paths = (location.pathname || "").substring(1).split('/')
let currentDesignElement, currentDesign;
for (let path of paths) {
    if (currentDesign && path) {
        currentDesignElement = currentDesign.getElement(path)
    } else if(path){
        let designId = location.origin + `/flowdesign/${path}/index.js`||"https://flowaboard.github.io/abstract/index.js"
        currentDesignElement = await new DesignElement(path, path, path, 'flow-info', designId)
    }else{
        path = 'abstract';
        let designId = location.origin + `/flowdesign/${path}/index.js`
        currentDesignElement = await new DesignElement(path, path, path, 'flow-info', designId)
    }
}


const flow = await flowly.load(currentDesignElement)
abstractContent.appendChild(flow)






