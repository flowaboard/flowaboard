import {ElementGroup} from './group.js'
import {List} from './list.js'
import {Detail} from './detail.js'
import { Selection } from '../group-behaviour/selection.js';
class Tab extends ElementGroup{
    constructor() {
        super();
    } 
    _contentElementType;  
    get contentElementType(){
        return this._contentElementType||'ui-detail'
    }
    set contentElementType(value){
        this._contentElementType=value
    }
    _tabElementType;  
    get tabElementType(){
        return this._tabElementType||'ui-detail'
    }
    set tabElementType(value){
        this._tabElementType=value
    }
    selected;
    get CSS(){
        return `
        :host{
            display: flex;
            flex-direction:column;
        }
        :host{
            display: flex;
            flex-direction:column;
        }
        .content{
            display: flex;
        }
        slot[name="tabs"] ui-list{
            flex:3
        }
        slot[name="detail"] ui-detail{
            flex:7;
            height: auto;
        }
        `
    }
    get HTML(){
        return `        
        <div class="header">
            ${this.label}
        </div>
        <div class="content">
        <slot name="tabs">
            <ui-list />
        </slot>
        <slot name="detail">
            <ui-detail />
        </slot>
        </div>
        `
    }
    afterRender(){
        this.shadowRoot.querySelector('ui-list').value=this.value
        this.shadowRoot.querySelector('ui-list').addBehaviour(new Selection());
        this.shadowRoot.querySelector('ui-list').addEventListener('selected',this.handleSelected.bind(this))
        this.selected=this.default||this.value[0]
    }
    handleSelected(event){
        console.log(event.detail)
        this.selected=event.target.value
        this.updateChild()
    }
    async updateChild(){
        this.shadowRoot.querySelector('ui-detail').value=await this.selectedValue()
    }
    async selectedValue(){
        return this.selected.value||this.selected
    }
    static getSample(){
        const listElement=document.createElement(ElementGroup.elementRegistry[this])
        listElement.value=['Tab 1','Tab 2','Tab 3']
        return listElement
    }  
    
}
ElementGroup.register('ui-tab', Tab);
export { Tab };