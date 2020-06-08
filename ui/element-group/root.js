import {ElementGroup} from './group.js'
class Root extends ElementGroup{
    constructor() {
        super();
    }
    get CSS(){
        return `
        :host{
            width:100%;
            height:100%;
            display:block;            
        }
        `
    } 
    
}
ElementGroup.register('ui-root', Root);
export { Root };