import Element from'./element.js'
class Input extends Element{
    constructor() {
        super();
    }
    
    static getSample(){
        const input=document.createElement('ui-input')
        input.setAttribute('label','Label')
        return input
    }  

    get placeholder(){
        return this.getAttribute('placeholder')
    }
    get showLabel(){
        return !!this.getAttribute('showlabel')
    }
    set showLabel(value){
        return this.setAttribute('showlabel','true')
    }
    get showAction(){
        return !!this.getAttribute('showaction')
    }
    set showAction(value){
        return this.setAttribute('showaction','true')
    }
    beforeRender(){
        super.beforeRender()
        this.showLabel=true
    }
    get CSS(){
        return `
        :host{
            display:flex;
            width: 100%;
        }
        ::slotted(label),label{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: var(--ui-input-label-padding,0.2rem 2rem);
            flex:var(--ui-input-leabel-flex,2);
        }
        ::slotted(input),input{
            flex:var(--ui-input-input-flex,8);
            padding:var(--ui-input-input-padding,0.2rem);
            width: 100%;
        }
        ::slotted(button),button{
            flex:var(--ui-input-btton-flex,2);
            border: unset;
            padding: 0;
            background-color: unset;
        }
        `
    }
    get HTML(){
        return `
        <slot name="label">${this.showLabel&&this.label?`<label for="${this.name}">${this.label}</label>`:``}</slot>
        <slot name="input"><input type="${this.type}" placeholder="${this.placeholder||''}" name="${this.name}"></slot>  
        <slot name="action">${this.showAction?`<button type="submit"><i class="fa fa-search"></i></button>`:``}<slot>      
        `
        
    }
    afterRender(){
        this.shadowRoot.querySelector('input').addEventListener('change',this.handleInputChange.bind(this))
        this.shadowRoot.querySelector('input').addEventListener('keyup',this.handleInputChange.bind(this))
        this.shadowRoot.querySelector('input').value=this.value
    }  
    handleInputChange(){
        this._value=this.shadowRoot.querySelector('input').value
        const changeEvent = new CustomEvent('change', {
            bubbles: true,
            composed:true,
            detail: { value: () => this.value }
        });
        this.dispatchEvent(changeEvent)
        

    }
    
}
Element.register('ui-input', Input);
export { Input };