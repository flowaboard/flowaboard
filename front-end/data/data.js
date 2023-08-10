

import Debugger from "../lib/debugger.js";
class Data{
    constructor(){   
        //console.log(this.debugTag,Debugger.debugs[this.debugTag])     
        this.debugger=Debugger(Debugger.debugs[this.debugTag],this.debugTag)
    }
    get debugTag(){
        return 'data-'+this.constructor.name
    }
    eventListeners={

    }
    subscribe(type,listener){
        if(!this.eventListeners[type])this.eventListeners[type]=[]
        this.eventListeners[type].push(listener)
    }
    unsubscribe(type,listener){
        if(!this.eventListeners[type])this.eventListeners[type]=[]
        var arr = this.eventListeners[type];
        for( var i = 0; i < arr.length; i++){
             if ( arr[i] === listener) {
                 arr.splice(i, 1); i--; 
            }
        }
    }
    publish(event){
        if(event){
            if(!this.eventListeners[event.type||event])this.eventListeners[event.type||event]=[]
            this.eventListeners[event.type||event].forEach(handler => {
                handler(event)
            });
        }
    }
    toString(){
        return this.constructor.name
    }

}


export {Data};