import { DesignElement } from './design.js'
import { Builder } from '../ui/builder/builder.js'
import { ElementSelection } from '../ui/builder/element-selection.js';

class UI extends DesignElement{
    constructor(type,label, uniqueIdentifier, processIdentifiers) {
        super('UI', label, uniqueIdentifier)
        this.processIdentifiers = new Set(processIdentifiers)
    }    
    getUi(){        
        const builder = document.createElement('ui-builder')
        const root=(builder.appendChild(document.createElement('ui-root')),builder.querySelector('ui-root'))
        const element=document.createElement('ui-element')
        element.innerHTML='Hello World'
        root.appendChild(element)
        const input=document.createElement('ui-input')
        input.setAttribute('label','Email')
        root.appendChild(input)
        root.addBehaviour(new ElementSelection())
        return builder;
    }
}
export {UI}