import { Behaviour } from "./behaviour.js";

class Text extends Behaviour{
    
    constructor() {

    }
   
    get HTML(){
        return ``
    }
    get CSS(){
        return `
        :host{
            font-size:var(--fontsize,1rem)
        }
        `
    }
}
export { Text };