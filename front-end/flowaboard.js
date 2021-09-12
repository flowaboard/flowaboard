
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
    pushState(present, future,skipWindowHistory) {
        if(future instanceof FlowDesigns.ListDesign && !skipWindowHistory){
            window.history.pushState({},future.label,(location.pathname=='/'?'':location.pathname)+"/"+future.id)
        }
        this.graph.set(future, present)
    }
    popState(present,skipWindowHistory) {
        let past = this.graph.get(present)
        if(present instanceof FlowDesigns.ListDesign && past && !skipWindowHistory){
            window.history.back()
        }
        
        return past;
    }
    historyListener(e){
        let currentDesign = this.getCurrentDesign()
        let parentdesign = this.popState(currentDesign)
        if (parentdesign){
            this.load(parentdesign)

        }else{
            e.preventDefault()
        }
    }
    constructor(parent) {
        this.parent = parent;
        //window.addEventListener('popstate', (e)=>this.historyListener(e));
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
        if (this.flow) {
            return flow
        }
        this.flow = Flow.getNewInstance();



        this.flow.addEventListener('openflow', async (e) => {
            console.log('flow', e.detail.value)
            if (e.detail.value) {
                this.openFlow(e.target, e.detail.value)

            }

        })
        this.flow.addEventListener('closeflow', async (e) => {
            console.log('flow', e.detail.value)
            if (e.detail.value) {
                this.closeFlow(e.target, e.detail.value)
            }

        })

        return this.flow;
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
    getCurrentDesign(){
        return this.flow.value;
    }
    getPreviousDesign(){
        return this.flow.value.parent;
    }


}

export default FlowAboard;