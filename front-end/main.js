

import {Design,DesignElement,FlowDesigns} from './flowdesign/design.js';

import * as ui from '../../ui/export.js'
import { Flow } from './ui/element-group/flow.js'
import { UI } from './flowdesign/ui.js'
import { Database } from './flowdesign/database.js'

import { Element } from './ui/element/element.js'

import { SQL } from './data/data.js'



class FlowAboard {
    static async load(designId) {

        const flow = await FlowAboard.getFlowInstance();
        const design = await FlowAboard.loadDesign(designId);
        flow.value = design;
        design.subscribe('change', (e) => {
            flow.update(e)
        })
    }
    static async getFlowInstance() {
        const flow = Flow.getNewInstance();

        document.body.appendChild(flow)

        //flow.getFlowElement(jsProcess).active()

        flow.activeWidth = "60%"
        flow.activeHeight = "60%"
        flow.addEventListener('switchflow', function (e) {
            console.log('switchflow', e.detail.value)
            if (e.detail.value.design) {
                flow.value = e.detail.value.design
            } else if (Design.designParentDesign.get(e.detail.value)) {
                flow.value = Design.designParentDesign.get(e.detail.value)
            }
        })
        return flow;
    }
    static async getElement(elementId) {
        class JsInput extends Element {
            constructor() {
                super();
            }

            static getSample() {
                const input = document.createElement('ui-input')
                input.setAttribute('label', 'Label')
                return input
            }

            get placeholder() {
                return this.getAttribute('placeholder')
            }
            get showLabel() {
                return !!this.getAttribute('showlabel')
            }
            set showLabel(value) {
                return this.setAttribute('showlabel', 'true')
            }
            get showAction() {
                return !!this.getAttribute('showaction')
            }
            set showAction(value) {
                return this.setAttribute('showaction', 'true')
            }
            beforeRender() {
                super.beforeRender()
                this.showLabel = true
            }
            get CSS() {
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
            get HTML() {
                return `
                <slot name="label">${this.showLabel && this.label ? `<label for="${this.name}">${this.label}</label>` : ``}</slot>
                <slot name="input"><input type="${this.type}" placeholder="${this.placeholder || ''}" name="${this.name}"></slot>  
                <slot name="action">${this.showAction ? `<button type="submit"><i class="fa fa-search"></i></button>` : ``}<slot>      
                `

            }
            afterRender() {
                this.shadowRoot.querySelector('input').addEventListener('change', this.handleInputChange.bind(this))
                this.shadowRoot.querySelector('input').addEventListener('keyup', this.handleInputChange.bind(this))
                this.shadowRoot.querySelector('input').value = this.value
            }
            handleInputChange() {
                this._value = this.shadowRoot.querySelector('input').value
                const changeEvent = new CustomEvent('change', {
                    bubbles: true,
                    composed: true,
                    detail: { value: () => this.value }
                });
                this.dispatchEvent(changeEvent)


            }

        }
        Element.register('js-input', JsInput);
        return { JsInput }
    }
    static async loadDesign(designId) {
        var abstractDesign = new FlowDesigns.ListDesign('Abstract', 'abstract', `https://en.wikipedia.org/wiki/Abstraction`)
        abstractDesign.add(new DesignElement('Mathematics', 'mathematics', `https://en.wikipedia.org/wiki/Mathematics`,'flow-info',''))
        abstractDesign.add(new DesignElement('Programming', 'programming', `https://en.wikipedia.org/wiki/Computer_programming`))
        abstractDesign.add(new DesignElement('AI', 'ai', 'https://en.wikipedia.org/wiki/Artificial_intelligence'))
        abstractDesign.add(new DesignElement('Business', 'business', 'https://en.wikipedia.org/wiki/Business'))

        abstractDesign.flowConfig = {
            flex: true,
            defaultValue: {
                widthfactor: abstractDesign.designElements.length,
                xPadding: 0.4,
                yPadding: 0.4,
            },
            action: {

            }
        }
        switch (designId) {
            case 'abstract':
                return abstractDesign;
                break;
            case FlowAboard.Utility().isURL(designId):
                return Design.getNewInstance(await fetch(designId));
                break;
            default:
                return ListDesign
                break;
        }
    }
    static Utility(){
        return {
            isURL:function(data){
                var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
                var regex = new RegExp(expression);
                return data.match(regex)
            }
        }
    }
}

// var design = new flowDesigns.LogicDesign()

// design.add(new Process('Process1','process1',['database','src'],['ui']))

// design.add(new Process('Process2','process2',['database','src'],['ui']))

// design.add(new Process('Process3','process3',['database','src'],['ui']))

//design.addInput(new Input('Inbound','Inbound','json',['process']))

FlowAboard.load('abstract')

console.log(esprima)

console.log(MathJax);



