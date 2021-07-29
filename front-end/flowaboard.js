
import { Design, DesignElement, FlowDesigns } from './flowdesign/design.js';

import { Flow } from './ui/element-group/flow.js'

import { Element } from './ui/element/element.js'

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

            const flow = await this.getFlowInstance();

            flow.value = design;
            design.subscribe('change', (e) => {
                flow.update(e)
            })

            return flow
        } catch (error) {
            console.error(error)
        }

    }
    async getFlowInstance() {

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
    async openFlow(target, designElement) {
        let currentDesign = target.value
        let futuredesign = await designElement.toFlowly()
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


}

export default FlowAboard;