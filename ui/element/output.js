import {Element} from './element.js'
class Output extends Element{
    constructor() {
        super();
    }
    
    static getSample(){
        const output=document.createElement('ui-output')
        output.setAttribute('label','Label')
        return output
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
        :host,:host{
            display:flex;
            width: 100%;
        }
        ::slotted(label),label{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: var(--ui-output-label-padding,0.2rem 2rem);
            flex:var(--ui-output-leabel-flex,2);
        }
        ::slotted(output),output{
            flex:var(--ui-output-output-flex,8);
            padding:var(--ui-output-output-padding,0.2rem);
            width: 100%;
        }
        ::slotted(button),button{
            flex:var(--ui-output-btton-flex,2);
        }
        `
    }
    get HTML(){
        return `
        <slot name="label">${this.showLabel&&this.label?`<label for="${this.name}">${this.label}</label>`:``}</slot>
        <slot name="output"><div name="${this.name}"></slot>  
        <slot name="action">${this.showAction?`<button type="submit"><i class="fa fa-search"></i></button>`:``}<slot>      
        `
        
    }
    attachEventHandlers(){
        this.shadowRoot.querySelector('div').addEventListener('change',this.handleOutputChange.bind(this))
        this.shadowRoot.querySelector('div').addEventListener('keyup',this.handleOutputChange.bind(this))
    }  
    handleOutputChange(){
        this._value=this.shadowRoot.querySelector('div').value
        const changeEvent = new CustomEvent('change', {
            bubbles: true,
            composed:true,
            detail: { value: () => this.value }
        });
        this.dispatchEvent(changeEvent)
        

    }
    
}
Element.register('ui-output', Output);
export { Output };