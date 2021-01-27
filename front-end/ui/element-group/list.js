import {ElementGroup} from './group.js'
class List extends ElementGroup{
    constructor() {
        super();
        
    }
    _elementType;  
    get elementType(){
        return this._elementType||'ui-element'
    }
    set elementType(value){
        this._elementType=value
    }
    get CSS(){
        return `
        :host {
            display: flex;
            flex-direction: column;
            overflow: auto;
        }
        :host ::slotted(${this.elementType}){
            padding:0.2rem;
            margin:0.4rem
            box-sizing: border-box;
            width: calc(100% - 0.8rem);
        }
        `
    }
    afterRender(){
        this.innerHTML='';
        (this.value||[]).forEach(child => {
            const ui_element=document.createElement(this.elementType)
            ui_element.value=child
            this.appendChild(ui_element)
        });
        
        super.afterRender()
    }
    static getSample(){
        const listElement=document.createElement(ElementGroup.elementRegistry[this])
        listElement.value=['Item 1','Item 2','Item 3']
        return listElement
    }  
    
}
ElementGroup.register('ui-list', List);
export { List };