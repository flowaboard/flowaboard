import { GroupBehaviour } from "./group-behaviour.js";
import { Draggable } from "../behaviour/draggable.js";
import { Resizable } from "../behaviour/resizable.js";
import {Sortable as SortableFramwork,MultiDrag} from '../../node_modules/sortablejs/modular/sortable.esm.js';

class Sortable extends GroupBehaviour {

    constructor() {
        super()
    }
    attachEventHandlers(){
        
        SortableFramwork.mount(new MultiDrag());
        SortableFramwork.create(this.host,{
            group: 'shared',
            multiDrag: true,
            selectedClass: "selected",
            animation: 150,
            swapThreshold: 0.65,
          })
          for(var child of this.host.children){
            new Sortable(child, {
                group: 'nested',
                animation: 150,
                multiDrag: true,
                selectedClass: "selected",
                fallbackOnBody: true,
                swapThreshold: 0.65
            });
        }
        
    }
    removeEventHandlers(){
        // for(var child of this.host.children){
        //     //console.log('removeEventHandlers : '+child.constructor.name)
        //     child.removeEventListener(this.handleSelectionEventname, this.handleSelection);
        //     child.removeEventListener(this.handleDeSelectionEventname, this.handleDeSelection);
        // }        
        // document.removeEventListener('keydown', this.ctrlSelectionHandler);
        // this.host.removeEventListener('click', this.outsideSelectionHandler);
        
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
        .selected{
            background-color: #f9c7c8 !important;
            border: solid red 1px !important;
            z-index: 1 !important;
        }
        `
    }
}
export { Sortable };