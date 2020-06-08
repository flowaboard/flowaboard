import { Behaviour } from "./behaviour.js";

class Mutation extends Behaviour{
    
    constructor(host) {
        this.host=host
    }
    
    
    afterRender(){
        const config = { attributes: true, childList: true, subtree: true };
        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                }
                else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');
                }
            }
        };

        // Create an observer instance linked to the callback function
        this.observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        this.observer.observe(this.host, config);

    }
    remove(){
        this.observer.disconnect();
    }
    
}
export { Mutation };