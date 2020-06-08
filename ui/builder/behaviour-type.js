import {Element} from '../element/element.js'
class BehaviourType extends Element{
    constructor() {
        super();
    }
    get CSS(){
        return `
        :host{
            display:block;
            
        }
        :host{
            display:flex;
            justify-content: space-between;
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
        .fa.fa-plus:hover{
            transform:"scale(1.1)",
            curstor:poitner
        }
        slot[name="icon"] {
            flex:1
        }
        slot[name="label"] {
            flex:6
        }
        slot[name="remove"] {
            flex:1
        }
        `
    }
    get HTML(){
        return `        
        <slot name="icon"><i class="fa ${this.value.faIconName}"></i></slot>
        <slot name="label"><label>${this.value.Name}</label></slot>
        <slot name="add"><i class="fa fa-plus"></i></slot>        
        `
        
    }
    attachEventHandlers(){
        this.shadowRoot.querySelector('i.fa.fa-plus').addEventListener('click',this.add.bind(this))
        
    }
    add(){
        console.log(this.value)
        const addbehaviourrequestEvent = new CustomEvent('addbehaviourrequest', {
                bubbles: true,
                composed:true,
        });
        this.dispatchEvent(addbehaviourrequestEvent)
    }
    
}
Element.register('ui-behaviour-type', BehaviourType);
export { BehaviourType };