import {Element} from '../element/element.js'
class ElementType extends Element{
    constructor() {
        super();
    }
    get CSS(){
        return `
        :host{            
            display:flex;
            justify-content: flex-start;
            padding:0.4rem;
        }
        ::slotted(label),label{
            flex:var(--ui-input-input-flex,8);
            padding:var(--ui-input-input-padding,0.2rem)
        }
        ::slotted(button),button{
            flex:var(--ui-input-btton-flex,2);
        }
        slot{
            display: flex;
            align-items: center;
        }
        .fa{
            
            margin-right: 0.5rem;
        }
        `
    }
    get HTML(){
        return `
        <slot name="icon"><i class="fa ${this.value.faIconName}"></i></slot>
        <slot name="label"><label>${this.value.Name}</label></slot>        
        `
        
    }
    
}
Element.register('ui-element-type', ElementType);
export { ElementType };