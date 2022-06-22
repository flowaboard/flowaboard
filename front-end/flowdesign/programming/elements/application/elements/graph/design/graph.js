import { FlowDesigns, Process, Input, Output } from '/flowdesign/design.js';
import { Graph } from '/ui/element-group/graph.js';
import Javascript from '/flowdesign/programming/elements/language/elements/javascript/design/javascript.js'

const functionJs= new Javascript('function','function')
functionJs.add
functionJs.js=`
var x=[],y=[];
for(let i=start;i<=end;i++){
    x.push(i);
    y.push(i*i);
}
return {x,y}`




class GraphDesign extends FlowDesigns.ProcessDesign {
    
    getOutputUi(){
        var graphView = Graph.getNewInstance();
        return graphView;
    }
    

}
class GraphLoader extends Process {    
    async execute(){
        var data= await this.parent.getElement('data').execute()
        var element = await this.parent.getElement('element').execute()
        element.value=data;
        return element
    }
}
class GraphUiInput extends Input {
    ui;
    get value(){
        return this.ui||Graph.getNewInstance()
    }
    async execute(){
        return this.value;
    }
    async getUi(status, parent) {
        //return this.value.cloneNode(true)
        return `
        <style>
        div{
            display: flex;
            align-content: center;
            width: 100%;
            justify-content: center;
            align-items: center;
        }
        </style>
        <div>
            ${this.value.tagName}        
        </div>
        `
        
    }
}
class GraphDataInput extends Input {
    design=functionJs
    execute(){
        return ([this.design && this.design.execute(1,1000)])||(this.parent.value && this.parent.value['data'])||[]
    }
}
class GraphOutput extends Output {
    async getUi(status, parent) {
        return await this.value[0]
    }
}

export {GraphDesign as default, GraphLoader,GraphUiInput,GraphDataInput,GraphOutput}