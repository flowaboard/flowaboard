import {Element} from '../element/element.js'
class BehaviourEditor extends Element{
    constructor() {
        super();
    }
    get CSS(){
        return `
        :host{
            display:block;
            background: darkblue;
            color: #c8e0e2;
            border-bottom: 2px solid dodgerblue;
            
        }
        :host>.behaviour{
            display:flex;
            justify-content: space-between;
            padding:0.4rem;
        }
        :host>.behaviour_editor{
            display:flex;
            padding: 0.6rem;
            font-size: 0.8rem;
            color: cornflowerblue;
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
        slot[name="icon"] {
            flex:1
        }
        slot[name="label"] {
            flex:6
        }
        slot[name="remove"] {
            flex:1;
            cursor: pointer;
            display:flex;
            justify-content: center;
            transition: all .2s ease-in-out;
        }
        slot[name="remove"]:hover{
            transform: scale(1.4);
        }
        fa{
            margin:0
        }
        `
    }
    get HTML(){
        return `
        <span class="behaviour">        
            <slot name="icon"><i class="fa fa-cogs"></i></slot>
            <slot name="label"><label>${this.value.constructor.name}</label></slot> 
            <slot name="remove"><i class="fa fa-minus" aria-hidden="true"></i></slot>
        </span>
        <span class="behaviour_editor">
            ${this.value.toJSON()}
        </span>       
        `
        
    }
    afterRender(){
        this.shadowRoot.querySelector('i.fa.fa-minus').addEventListener('click',this.remove.bind(this))
    }
    remove(){
        console.log(this.value)
        const addbehaviourrequestEvent = new CustomEvent('removebehaviourrequest', {
                bubbles: true,
                composed:true,
        });
        this.dispatchEvent(addbehaviourrequestEvent)
    }
    
}
Element.register('ui-behaviour-editor', BehaviourEditor);
export { BehaviourEditor };