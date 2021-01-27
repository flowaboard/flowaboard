import {ElementGroup} from './group.js'
class Next extends ElementGroup{
    constructor() {
        super();
    }  
    
    get CSS(){
        `<style>

        </style>`
    }
    get HTML(){
        return `
        <div class='ui_layout ${this.type} '>
        </div>`
    }
    
}
ElementGroup.register('ui-next', Next); 
export { Next };