import {ElementGroup} from './group.js'
class Detail extends ElementGroup{
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
        :host{
            display: flex;
            width: 100%;
        }
        `
    }
    get HTML(){
        return`        
        <slot name="default">${this.value}</slot>        
        `
    }
    afterRender(){
        
    } 
    
}
ElementGroup.register('ui-detail', Detail);
export { Detail };