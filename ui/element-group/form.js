import {ElementGroup} from './group.js'
class Form extends ElementGroup{
    constructor() {
        super();
    }
    get HTML(){
        return`
        <form name="${this.name}">
            <slot>
            
            </slot>
        </form>
        `
    } 
    
}
ElementGroup.register('ui-form', Form);
export { Form };