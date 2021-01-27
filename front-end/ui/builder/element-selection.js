import { Selection } from "../group-behaviour/selection.js";
import { Draggable } from "../behaviour/draggable.js";
import { Resizable } from "../behaviour/resizable.js";
import { DragAndDrop } from "../group-behaviour/drag-and-drop.js";
import { Sortable } from '../group-behaviour/sortable.js'

class ElementSelection extends Selection {

    constructor() {
        super()
    }
    
    get HTML() {
        return `
        `
    }
    get CSS() {
        return `
        ([selected]) {
            outline: 2px solid blue;
        }
        
        ::slotted(.selected),.selected{
            z-index: 1 !important;
            transform: scale(1.02);
            
            box-shadow: 0px 0px 3px 1px powderblue;        
        }
        ::slotted(.selected) *,.selected *{
            cursor: move;
        }
        `
    }
    handleSelectedChild(event){
        
        event.preventDefault()
        //event.target.addBehaviour(new Resizable())
        const elementselectedEvent = new CustomEvent('elementselected', {
                bubbles: true,
                composed:true,
        });
        event.target.dispatchEvent(elementselectedEvent)
            
    }
    handleDeSelectedChild(event){
        
        event.preventDefault()
        //event.target.removeBehaviours('Resizable')
        const elementdeselectedEvent = new CustomEvent('elementdeselected', {
            bubbles: true,
            composed:true
    });
    event.target.dispatchEvent(elementdeselectedEvent)
    }
}
export { ElementSelection };