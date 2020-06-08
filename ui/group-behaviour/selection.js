import { GroupBehaviour } from "./group-behaviour.js";

class Selection extends GroupBehaviour {

    constructor() {
        super()
    }
    _slelectedElements=[]
    _handleSelectionEventname="click"
    _handleDeSelectionEventname="mouseup"
    _overrideDeselection=false
    attachEventHandlers(){
        
        //console.log('attachEventHandlers : '+child.constructor.name)
        this._handleSelectionHandler=this._handleSelection.bind(this)
        this._handleDeSelectionHandler=this._handleDeSelection.bind(this)
        this.host.addEventListener(this._handleSelectionEventname, this._handleSelectionHandler);
        //this.host.addEventListener(this._handleDeSelectionEventname, this._handleDeSelectionHandler);
        
        
    }
    removeEventHandlers(){
        
        this.host.removeEventListener(this._handleSelectionEventname, this._handleSelectionHandler);
        //this.host.removeEventListener(this._handleDeSelectionEventname, this._handleDeSelectionHandler);
              
    }
    get HTML() {
        return `
        `
    }
    getStyle() {
        return `
        ([selected]) {
            outline: 2px solid blue;
        }
        `
    }
    hasModifier(e)
    {
        return (e.ctrlKey || e.metaKey || e.shiftKey);
    }
    _handleSelection(event){
        event.preventDefault()
        if(this.host==event.target.parentNode){         
            
            if(this._slelectedElements.indexOf(event.target)<0 && event.target!=this.host){
                this._currentSelectedElment=event.target
                this._slelectedElements.push(event.target)          
                event.target.selected=true
                event.target.setAttribute('selected','true')
                event.target.setAttribute('tabindex',"-1")
                const selectedEvent = new CustomEvent('selected', {
                    bubbles: true
                });
                event.target.dispatchEvent(selectedEvent)
                //event.target.focus()
                for(var i = this._slelectedElements.length-1; i >=0; i --)
                {   
                    if(this._slelectedElements[i]!=event.target && !this.hasModifier(event)){
                        this._handleDeSelection(this._slelectedElements[i]);
                        this._slelectedElements.splice(i,1);
                    }                
                }
                this.handleSelectedChild(event)
                
            }
        }else if(event.target==this.host){
            for(var i = this._slelectedElements.length-1; i >=0; i --)
            {   this._handleDeSelection(this._slelectedElements[i]);
                this._slelectedElements.splice(i,1);                              
            }
        }else{
            if(event.target.parentNode!=null&&this.host!=event.target.parentNode)
            event.target.parentNode.click()
        }
        
    }
    handleSelectedChild(event){

    }
    _handleDeSelection(deselectedElement){
        console.log(deselectedElement)
        //console.log('handleDeleseltion:'+this.constructor.name+":"+event.ctrlKey)
        
        if(this._slelectedElements.indexOf(deselectedElement)>=0){

            deselectedElement.selected=false
            deselectedElement.removeAttribute('selected')
            deselectedElement.removeAttribute('tabindex')
            
            const deselectedEvent = new CustomEvent('deselected', {
                bubbles: true
            });
            
            var deslectedHandler=this.handleDeSelectedChild.bind(this)
            deselectedElement.addEventListener('deselected',deslectedHandler)
            deselectedElement.dispatchEvent(deselectedEvent)
            deselectedElement.removeEventListener('deselected',deslectedHandler)
            

        }
    }
    handleDeSelectedChild(event){

    }
}
export { Selection };