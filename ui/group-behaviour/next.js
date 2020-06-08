import { GroupBehaviour } from "./group-behaviour.js";
import { Visibility } from "../behaviour/visibility.js";

class Next extends GroupBehaviour {

    constructor() {
        super()
    }
    at='Bottom';
    nextIndex=1;
    previousIndex=-1;
    currentIndex=1;
    attachEventHandlers(){
        
        
    }
    removeEventHandlers(){
        
    }
    get HTML() {
        return `
        <slot name="next">
           <button slot="action" name="previous" type="submit"><i class="fa fa-search"></i>Previous</button>
           <button slot="action" name="next" type="submit"><i class="fa fa-search"></i>Next</button>
        </slot>
        `
    }
    get CSS() {
        return `
        
        ui-input{
            margin: 0.4rem;
            display: block;
            width: calc(100% - 0.8rem);
            box-sizing: content-box;
        }
        slot:not([name]){
            height: 100%;
            display: block;
            overflow: auto;
        }
        :host{
            display: flex;
            flex-direction: column;
            overflow: auto;
            height: 100%;
        }

        `
    }

    afterRender(){
        for(var child of this.host.children){
            child.addBehaviour(new Layout())
        }
    }
    attachEventHandlers(){
        console.log('attachEventHandlers:',this.host.classList)
        this.host.shadowRoot.querySelector('ui-input').addEventListener('change',this.handleSearch.bind(this))
    }
    handleNavigation(index){
        var i=0;
        for(var child of this.host.children){
            if(i==index){
                child.behaviour.Visibility.hidden=false
            }else{
                child.behaviour.Visibility.hidden=true
            }
            i++;
        }
    }
}
export { Next };