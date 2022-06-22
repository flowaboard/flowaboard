import {ElementGroup} from '../element-group/group.js'
import Element from '../element/element.js'
import * as ui from '../export.js'
import { Search } from '../group-behaviour/search.js';
import { ElementType } from './element-type.js'
import { BehaviourType } from './behaviour-type.js'
import { BehaviourEditor } from './behaviour-editor.js'
import { BehaviourList } from './behaviour-list.js';

import { DragAndDropElments } from './drag-and-drop.js';
import { Sortable, Selection } from '../group-behaviour/export.js';
import { ElementSelection } from './element-selection.js';
class Builder extends ElementGroup{
    constructor() {
        super();        
        this.pushBehaviour(new DragAndDropElments())
    }
     
    get CSS(){
        return `
        :host{
            display:flex;
            height:100%;
            width:100%;
        }
        
        .elements{
            flex:1;
            transition: all .2s ease-in-out;
        }
        .elements.hidden{
            width:0;
            flex: 0 auto;
        }
        .board{
            flex: 3;
            box-shadow: inset 1px 0px 8px 2px grey;
            overflow:auto;
            z-index:2
        }
        .behaviours{
            flex:1
            transition: all .2s ease-in-out;
        }
        .behaviours.hidden{
            width:0;
            flex: 0 auto;
        }
        @keyframes expand {
            from {
              transform: scale(0.95);
              opacity: 0.5;
              background: #5470B0;
            }
        }
        .behaviours builder-behaviour-list ui-behaviour-editor,.behaviours builder-behaviour-list ui-behaviour-type{
            animation: expand .2s ease-in-out;
        }
        .behaviours builder-behaviour-list,
        .elements ui-list{
            overflow:auto;
            font-size: 0.8rem;
            font-family: monospace;            
            height: 100%;
            background: #eee;
            transition: all .2s ease-in-out;
        }        
        ui-element-type{
            margin: 0.4rem;
            transition: 0.3s;
            
        }
        ui-element-type:hover {
            background-color: #3e8e41;
            color: white;
          }
        .board>* {            
            margin: 0.2rem;
            box-sizing: border-box;
            width: calc(100% - 0.4rem);
            height: calc(100% - 0.4rem);
            box-shadow: 0px 0px 2px 1px #252a2b;
        }
        .board [selected] {
            outline: 1px solid blue;
            z-index: 1000;
            box-shadow: -3px 2px 15px 5px grey;
            transform: scale(0.99);
            transition: all 0.2s;
        }
        `
    }
    get HTML(){
        return `
        <div class="elements"><ui-list value='[]'></ui-list></div>
        <div class="board"><ui-root></ui-root></div>
        <div class="behaviours">
            <builder-behaviour-list value='[]'></builder-behaviour-list>
        </div>
        
        `
    }
    attachEventHandlers(){

    }
    afterRender(){

        console.log(ui)
        const elements=[...Object.keys(ui.elements),...Object.keys(ui.elementGroups)].map(key=>{
            if(ui.elements[key]||ui.elementGroups[key]){
                return {
                    Name:key,
                    tagName:ElementGroup.elementRegistry[ui.elements[key]||ui.elementGroups[key]],
                    faIconName:'fa-th'
                }
            }
        })

        this.allbehaviours=[...Object.keys(ui.behaviours),...Object.keys(ui.groupbehaviours)].map(key=>{
            if(ui.behaviours[key]||ui.groupbehaviours[key]){
                return {
                    Name:key,
                    tagName:ElementGroup.elementRegistry[ui.behaviours[key]||ui.groupbehaviours[key]],
                    faIconName:'fa-cogs'
                }
            }
        })

        //Setup child elments and behaviour

        //Element List     
        this.shadowRoot.querySelector('.elements ui-list').elementType='ui-element-type'
        this.shadowRoot.querySelector('.elements ui-list').value=elements
        this.shadowRoot.querySelector('.elements ui-list').addBehaviour(new Search())

        var draggables=this.shadowRoot.querySelectorAll('.elements ui-list ui-element-type');
        var dropables=this.shadowRoot.querySelectorAll('ui-root');
        this.behaviour.DragAndDropElments.drageelements=draggables;
        this.behaviour.DragAndDropElments.dropElements=dropables;
        this.shadowRoot.querySelector('ui-root').addBehaviour(new Sortable())
        this.shadowRoot.querySelector('ui-root').addBehaviour(new ElementSelection())


        //Behavour List        

        this.shadowRoot.querySelector('.behaviours builder-behaviour-list').addBehaviour(new Search())
        
        this.handleElementDeSlected()

        this.shadowRoot.querySelector('ui-root').addEventListener('elementselected',event=>this.handleElementSlected(event))

        this.shadowRoot.querySelector('ui-root').addEventListener('elementdeselected',event=>this.handleElementDeSlected(event))

        this.shadowRoot.querySelector('.behaviours builder-behaviour-list').addEventListener('addbehaviourrequest',event=>this.handleAddBehaviourRequest(event))
        
        this.shadowRoot.querySelector('.behaviours builder-behaviour-list').addEventListener('removebehaviourrequest',event=>this.handleRemoveBehaviourRequest(event))
        

    }
    handleElementSlected(event){
        this.selected=event.target
        this.shadowRoot.querySelector('.behaviours builder-behaviour-list').value=event.target.behaviours.concat(this.allbehaviours.filter(b=>event.target.behaviours.map(v=>v.constructor.name).indexOf(b.Name)<0))
        
    }
    handleElementDeSlected(){
        this.selected=this.shadowRoot.querySelector('ui-root')
        this.shadowRoot.querySelector('.behaviours builder-behaviour-list').value=this.selected.behaviours.concat(this.allbehaviours.filter(b=>this.selected.behaviours.map(v=>v.constructor.name).indexOf(b.Name)<0))
        
    }
    handleAddBehaviourRequest(event){
        
        const behaviour=ui.behaviours[event.target.value.Name]||ui.groupbehaviours[event.target.value.Name]
        this.selected.addBehaviour(new behaviour());        
        this.shadowRoot.querySelector('.behaviours builder-behaviour-list').value=this.selected.behaviours.concat(this.allbehaviours.filter(b=>this.selected.behaviours.map(v=>v.constructor.name).indexOf(b.Name)<0))
    }
    handleRemoveBehaviourRequest(event){ 
        const behaviourName=  event.target.value.constructor.name     
        this.selected.removeBehaviour(behaviourName);        
        this.shadowRoot.querySelector('.behaviours builder-behaviour-list').value=this.selected.behaviours.concat(this.allbehaviours.filter(b=>this.selected.behaviours.map(v=>v.constructor.name).indexOf(b.Name)<0))
    }

}
Element.register('ui-builder', Builder);
export { Builder };