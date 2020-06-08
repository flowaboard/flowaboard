import {ElementGroup} from './group.js'
class Section extends ElementGroup{
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
ElementGroup.register('ui-section', Section);
export { Section };