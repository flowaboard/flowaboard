import { DesignElement, FlowDesigns, Process, Input, Output } from '/flowdesign/design.js';


import FunctionDesign from './function.js';

class FunctionListElement extends DesignElement {

    async toDesign() {
        var flow, functionDesign = new FunctionDesign(), elementAction;
        try {
            flow = await (await fetch(import.meta.url.replace('/functions.js','') + '/../elements/' + this.id + '.flow')).text()
            this.debugger.log(flow)
            functionDesign.fromJSON(flow)
            elementAction = {
                "click": { "action": "active", "state": "default" }
            }
        } catch (error) {
            functionDesign.fromJSON(JSON.stringify(this))
            elementAction = {
                "loaded": { "action": "active", "state": "default" }
            }
        }

        functionDesign.flowConfig = {
            elementAction,
            flowAction: {
                "buttons": [
                    { label: "Execute", icon: "", id: 'execute', handler: functionDesign.execute },
                    { label: "Download", icon: "", id: 'dl', handler: functionDesign.download }
                ]
            },
        }


        return functionDesign;
    }
}

class FunctionListDesign extends FlowDesigns.ListDesign{

}

export {FunctionListElement,FunctionListDesign as default}
