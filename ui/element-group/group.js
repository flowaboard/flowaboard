import {Element} from '../element/element.js'
class ElementGroup extends Element{
    constructor() {
        super();
    } 
    get CSS(){
        return `
        :host {
            display:flex;
            height:100%;
            width:100%
        }
        `
    }
    
}
ElementGroup.register('ui-element-group', ElementGroup);
export { ElementGroup };