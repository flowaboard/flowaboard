import {ElementGroup} from './group.js'
class Table extends ElementGroup{
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
ElementGroup.register('ui-table', Table);
export { Table };