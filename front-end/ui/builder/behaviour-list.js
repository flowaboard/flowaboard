import { Behaviour } from '../behaviour/behaviour.js';
import { List } from '../element-group/list.js';
import { Element } from '../element/element.js'
class BehaviourList extends List{
    constructor() {
        super();
        
    }
    get CSS(){
        return `
        ${super.css}
        
        slot:not([name]){
            color:green
        }
        slot:not([name])::-webkit-scrollbar {
            width: 0.5em;
        }

        slot:not([name])::-webkit-scrollbar-track {
            background: #f1f1f1; 
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }
        
        slot:not([name])::-webkit-scrollbar-thumb {
            background: #888; 
        }

        slot:not([name])::-webkit-scrollbar-thumb:hover {
            background: #555; 
        }
        
        `
    }
    afterRender(){
        this.innerHTML='';
        (this.value||[]).forEach(child => {

            const ui_element=document.createElement(child instanceof Behaviour?'ui-behaviour-editor':'ui-behaviour-type')
            ui_element.value=child
            this.appendChild(ui_element)
        });
    }
    
}
Element.register('builder-behaviour-list', BehaviourList);
export { BehaviourList };