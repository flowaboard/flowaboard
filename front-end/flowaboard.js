
import { Design, DesignElement, FlowDesigns } from './flowdesign/design.js';

import { Flow } from './ui/element-group/flow.js'

import Element from './ui/element/element.js'

class Designs {
    static designMap = new Map()
    static put(designId, designInfo) {
        Designs.designMap.set(designId, designInfo);
        designInfo.path = Utility.getUrlFileName();
    }
    static get(designId) {
        Designs.designMap.get(designId).design
    }


}


class FlowAboard {

    parent = document.body;
    graph = new WeakMap();
    pushState(present, future) {
        this.graph.set(future, present)
    }
    popState(present) {
        return this.graph.get(present)
    }
    constructor(parent) {
        this.parent = parent;
    }
    async load(design) {
        try {

            const flow = await this.getFlowUi();

            flow.value = design;
            design.subscribe('change', (e) => {
                flow.update(e)
            })

            return flow
        } catch (error) {
            console.error(error)
        }

    }
    async getFlowUi() {

        let flow = this.parent.querySelector('ui-flow')
        if (flow) {
            return flow
        }
        flow = Flow.getNewInstance();



        flow.addEventListener('openflow', async (e) => {
            console.log('flow', e.detail.value)
            if (e.detail.value) {
                this.openFlow(e.target, e.detail.value)

            }

        })
        flow.addEventListener('closeflow', async (e) => {
            console.log('flow', e.detail.value)
            if (e.detail.value) {
                this.closeFlow(e.target, e.detail.value)
            }

        })

        return flow;
    }
    async getOutputUi(){
        
    }
    async openFlow(target, designElement) {
        let currentDesign = target.value
        let futuredesign = await designElement.toDesign()
        if (futuredesign) {
            this.load(futuredesign)
            this.pushState(currentDesign, futuredesign)
        }
    }
    async closeFlow(traget, designElement) {
        let currentDesign = traget.value
        let parentdesign = this.popState(currentDesign)
        if (parentdesign)
            this.load(parentdesign)
    }

    async getElement(elementId) {
        
    }


}

export default FlowAboard;