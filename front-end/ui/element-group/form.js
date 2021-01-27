import {ElementGroup} from './group.js'
import { Input } from '../element/input.js';
import { BoxModel } from '../behaviour/boxmodel.js'

class Form extends ElementGroup{
    constructor() {
        super();
    }
    static getSample(){
        const element=this.getNewInstance()
        element.value={
            Name:'Name value',
            Age:26,
            DOB:new Date()
        }
        return element
    }
    get CSS(){
        return `
        :host{
            display:block;
        }
        :host>form{
            margin: 0;
            padding: 0;
            width: 100%;
            justify-content: center;
            display: flex;
            flex-direction: column;
            postion:relative; 
        }`
    }
    get HTML(){
        return`
        <form name="${this.name}">
            <slot>
            
            </slot>
        </form>
        `
    } 
    afterRender(){
        var child = this.lastElementChild;  
        while (child) { 
            this.removeChild(child); 
            child = this.lastElementChild; 
        } 
        Object.getOwnPropertyNames(this.value).forEach(property=>{
            const input=Input.getNewInstance()
            input.label=property.replace( /([A-Z])/g, " $1" ).replace( /([_])/g, " " )
            input.name=property
            input.value=this.value[property]
            const boxModel=new BoxModel()
            boxModel.width='100%'
            input.addBehaviour(boxModel)
            this.appendChild(input)
            
        })
        for(var child of this.children){
            child.addEventListener('change',event=>this.valueChangeHandler(event))
        }
    }
    valueChangeHandler(event){
        this.value[event.target.name]=event.target.value
        console.log(event.target.name)
    }
    
    
}
ElementGroup.register('ui-form', Form);
export { Form };