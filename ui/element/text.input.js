import {Element} from './element.js'
class TextInput extends Input{
    constructor() {
        super();
    }
    get CSS(){
        return `
        :host{
            display:flex;
            width: 100%;
        }
        ::slotted(label),label{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: var(--ui-input-label-padding,0.2rem 2rem);
            flex:var(--ui-input-leabel-flex,2);
        }
        ::slotted(input),input{
            flex:var(--ui-input-input-flex,8);
            padding:var(--ui-input-input-padding,0.2rem);
            width: 100%;
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
        <slot name="input"><input type="text" placeholder="${this.placeholder||''}" name="${this.name}"></slot>  
        <slot name="action">${this.showAction?`<button type="submit"><i class="fa fa-search"></i></button>`:``}<slot>      
        `
        
    }
}
Element.register('ui-input', TextInput);
export { Input };