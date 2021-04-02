

import * as alaSQLSpace from './lib/alasql/dist/alasql.js';
import * as architecture from './data/architecture/architecture.js';

import * as ui from '../../ui/export.js'
import { Flow } from './ui/element-group/flow.js'
import { UI } from './data/architecture/ui.js'
import { Database } from './data/architecture/database.js'

import {Element} from './ui/element/element.js'

class JsInput extends Element{
    constructor() {
        super();
    }
    
    static getSample(){
        const input=document.createElement('ui-input')
        input.setAttribute('label','Label')
        return input
    }  

    get placeholder(){
        return this.getAttribute('placeholder')
    }
    get showLabel(){
        return !!this.getAttribute('showlabel')
    }
    set showLabel(value){
        return this.setAttribute('showlabel','true')
    }
    get showAction(){
        return !!this.getAttribute('showaction')
    }
    set showAction(value){
        return this.setAttribute('showaction','true')
    }
    beforeRender(){
        super.beforeRender()
        this.showLabel=true
    }
    get CSS(){
        return `
        :host{
            display: flex;
            width: 100%;
            border-radius: 0.5em;
            justify-content: center;
            align-items: center;
            /* background: #fdf9f9; */
            padding: 2rem;
        }
        ::slotted(label),label{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: var(--ui-input-label-padding,0.2rem 2rem);
            flex:var(--ui-input-leabel-flex,2);
        }
        ::slotted(input),input{
            flex: var(--ui-input-input-flex,8);
            width: 100%;
            max-height: 3rem;
            min-height: 3rem;
            font-size: 1.5rem;
            border-radius: 0.25rem;
            box-shadow: inset -1px 1px 4px 2px #efe4e4;
            padding: 2rem 0.5rem;
            border: 0;
            text-align: center;
        }
        ::slotted(button),button{
            flex:var(--ui-input-btton-flex,2);
            border: unset;
            padding: 0;
            background-color: unset;
        }
        `
    }
    get HTML(){
        return `
        <slot name="label">${this.showLabel&&this.label?`<label for="${this.name}">${this.label}</label>`:``}</slot>
        <slot name="input"><input type="${this.type}" placeholder="${this.placeholder||''}" name="${this.name}"></slot>  
        <slot name="action">${this.showAction?`<button type="submit"><i class="fa fa-search"></i></button>`:``}<slot>      
        `
        
    }
    afterRender(){
        this.shadowRoot.querySelector('input').addEventListener('change',this.handleInputChange.bind(this))
        this.shadowRoot.querySelector('input').addEventListener('keyup',this.handleInputChange.bind(this))
        this.shadowRoot.querySelector('input').value=this.value
    }  
    handleInputChange(){
        this._value=this.shadowRoot.querySelector('input').value
        const changeEvent = new CustomEvent('change', {
            bubbles: true,
            composed:true,
            detail: { value: () => this.value }
        });
        this.dispatchEvent(changeEvent)
        

    }
    
}
Element.register('js-input', JsInput);

var design = new architecture.LogicDesign()
var jsProcess=new architecture.Process('js','Process','process')
//design.addProcess(jsProcess)

design.addProcess(new architecture.Process('js','Process','process',['ui','ui2','ui3'],['database']))
design.addOutput(new architecture.Output('outbound.rest','Outbound','outbound.rest',['process']))
design.addOutput(new architecture.Output('outbound.rest2','Outbound2','outbound.rest2',['process']))



function add(i){
    // console.log(i)
    // design.addOutput(new architecture.Output('outbound.rest'+i,'Outbound'+i,'outbound.rest'+i,['process']))
    // if(i<4)
    // setTimeout(function(){
    //    add(i+1)
    // },100)
}

add(3)


//design.addProcess(new architecture.Process('js','Process2','process2',['ui2'],['database']))
// design.addOutput(new architecture.Output('outbound.rest','Outbound','outbound.rest2',['process2']))
// design.addOutput(new architecture.Output('outbound.rest','Google','outbound.rest3',['process2']))
// design.addOutput(new architecture.Output('outbound.rest','Facebook','outbound.rest4',['process2']))
// design.addOutput(new architecture.Output('outbound.rest','Twitter','outbound.rest5',['process2']))
// design.addInput(new architecture.Input('input.rest','Twitter','input.rest',['process2']))
const flow = Flow.getNewInstance();
document.body.appendChild(flow)
flow.value=design;
//flow.getFlowElement(jsProcess).active()
design.subscribe('change',(e)=>{
    flow.update(e)
})
flow.activeWidth="60%"
flow.activeHeight="60%"
flow.addEventListener('switchflow',function(e){
    console.log('switchflow',e.detail.value)
    if(e.detail.value.design){
        flow.value=e.detail.value.design
    }else if(architecture.Design.designParentDesign.get(e.detail.value)){
        flow.value=architecture.Design.designParentDesign.get(e.detail.value)
    }
})

alasql("CREATE TABLE example1 (a INT, b INT)");

// alasql's data store for a table can be assigned directly
alasql.tables.example1.data = [
    {a:2,b:6},
    {a:3,b:4}
];

// ... or manipulated with normal SQL
alasql("INSERT INTO example1 VALUES (1,5)");

var res = alasql("SELECT * FROM example1 ORDER BY b DESC");

console.log(res); // [{a:2,b:6},{a:1,b:5},{a:3,b:4}]

alasql('CREATE localStorage DATABASE IF NOT EXISTS Atlas');
alasql('ATTACH localStorage DATABASE Atlas AS MyAtlas');
alasql('CREATE TABLE IF NOT EXISTS MyAtlas.City (city string, population number)');
alasql('SELECT * INTO MyAtlas.City FROM ?',[ [
        {city:'Vienna', population:1731000},
        {city:'Budapest', population:1728000}
] ]);
var res = alasql('SELECT * FROM MyAtlas.City');
console.log(res);



console.log(esprima)


//design.addInput(new architecture.Input('Inbound','Inbound','json',['process']))