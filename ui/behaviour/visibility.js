import { Behaviour } from "./behaviour.js";

class Visibility extends Behaviour{
    
    constructor() {
        super()
    }
    set hidden(value){
        if(value){
            this.host.classList.add('hidden')
            this.host.setAttribute('hidden','true')
            this.host.dispatchEvent(new CustomEvent("hidden"));
        }else{
            this.host.classList.remove('hidden')
            this.host.removeAttribute('hidden')
            this.host.dispatchEvent(new CustomEvent("visible"));
        }
    }
    getObservedAttributes(){
        return ['hidden']
    }
    setAttribute(){
        //this.host.classList.add('hidden')
        //this.host.setAttribute('hidden','true')
    }
    attributeChangedCallback(name, oldValue, newValue) {
        
        if (name === "hidden" && this.shadowRoot) {
            if (newValue === null) {
                this.host.shadowRoot.querySelector(this.class).classList.remove("hidden");
                this.host.dispatchEvent(new CustomEvent("hidden"));
            } else {
                this.host.shadowRoot.querySelector(".ui").classList.add("hidden");
                this.host.dispatchEvent(new CustomEvent("hidden"))
            }
        }
        
    }
    get HTML(){

        return ``
    }
    get CSS(){
        return `
        :host {
            opacity: 1;
            visibility: visible;
            transform: scale(1);
            transition: visibility 0s linear 0s,opacity .25s 0s,transform .25s;
        }
        :host(.hidden){
            opacity: 0;
            visibility: hidden;
            transform: scale(1.1);
            transition: all .25s;
            height:0 !important;
            margin:0 !important;
            padding:0 !important;
        }
        `
    }
}
export { Visibility };