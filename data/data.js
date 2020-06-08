class Data{
    eventListeners={

    }
    addEventListener(type,listener){
        if(!this.eventListeners[type])this.eventListeners[type]=[]
        this.eventListeners[type].push(listener)
    }
    removeEventListener(type,listener){
        if(!this.eventListeners[type])this.eventListeners[type]=[]
        var arr = this.eventListeners[type];
        for( var i = 0; i < arr.length; i++){
             if ( arr[i] === listener) {
                 arr.splice(i, 1); i--; 
            }
        }
    }
    dispatchEvent(event){
        if(event){
            if(!this.eventListeners[event.type||event])this.eventListeners[event.type||event]=[]
            this.eventListeners[event.type||event].forEach(handler => {
                handler(event)
            });
        }
    }

}

export {Data};