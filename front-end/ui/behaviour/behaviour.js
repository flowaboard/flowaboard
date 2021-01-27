class Behaviour{
    
    // constructor(...hosts) {
    //     this.hosts=hosts||[]
    // }
    constructor(host) {
        this.host=host
    }
    at;
    addHost(host){
        this.host=host
        
    }
    remove(){
        this.removeEventHandlers()
    }
    getObservedAttributes(){
        return []
    }
    attributeChangedCallback(name, oldValue, newValue) {
        
    }
    beforeRender(){

    }
    afterRender(){

        console.log('afterrender',this.constructor.name,this.host.constructor.name)
        
    }
    setAttribute(){
        
    }

    get HTML(){

    }
    get CSS(){
        return `
        
        `
    }
    renderHost(){
        
    }
    updateWith(){
        
    }
    dependencies(){
        return []
    }
    attachEventHandlers(){
        this.host.addEventListener ("DOMNodeInserted", function(e) {
            console.log(e.relatedNaode)
        });
        
    }
    removeEventHandlers(){
    }
    toJSON(){
        return Object.keys(this).filter(v=>!v.indexOf("_")==0||[].indexOf(v)<0).reduce((a,v)=>{a[v]=this[v];return a},{})
        
    }
    getOwnPropertyNames(){
        return Object.getOwnPropertyNames(this).filter(v=>!v.indexOf("_")==0||[].indexOf(v)<0)
    }
}
export { Behaviour };