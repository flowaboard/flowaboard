import { GroupBehaviour } from "./group-behaviour.js";
import { Visibility } from "../behaviour/visibility.js";

class Search extends GroupBehaviour {

    constructor() {
        super()
    }
    at='Top';
    attachEventHandlers(){
        
        
    }
    removeEventHandlers(){
        
    }
    get HTML() {
        return `
        <slot name="search">
            <ui-input placeholder="Search" >
                <button slot="action" type="submit"><i class="fa fa-search"></i></button>
            </ui-input>
        </slot>
        `
    }
    get CSS() {
        return `
        
        ui-input{
            margin: 0.2rem;
            display: flex;
            width: calc(100% - 0.4rem);
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
        }
        `
    }

    afterRender(){
        for(var child of this.host.children){
            child.addBehaviour(new Visibility())
        }
    }
    attachEventHandlers(){
        console.log('attachEventHandlers:',this.host.classList)
        this.host.shadowRoot.querySelector('ui-input').addEventListener('change',this.handleSearch.bind(this))
    }
    handleSearch(e){
        console.log('Searching:'+e.target.value)
        for(var child of this.host.children){
            if(!e.target.value){
                child.behaviour.Visibility.hidden=false
            }else if(this.search(child.value,e.target.value)){
                child.behaviour.Visibility.hidden=false
            }else{
                child.behaviour.Visibility.hidden=true
            }
        }
    }
    search(data,searchTerm){
        if(data.toLowerCase){
            return data.toLowerCase().indexOf(searchTerm.toLowerCase())>=0
        }else{
            var res = Object.keys(data).filter(function(key) {
                
                if(data[key]&&data[key].toLowerCase){
                    return data[key].toLowerCase().indexOf(searchTerm.toLowerCase())>=0
                }
            });
            return res.length>0; 
        }
    }
}
export { Search };