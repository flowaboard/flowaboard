class Network{
    async request(){
        return {}
    }    
}
class Http extends Network{
    requestHeaders;
    responseHeaders;
    requestBody;
    responseBody;
    async get(){
        return {}
    }
    async post(){
        return {}
    }
    async put(){
        return {}
    }
    async patch(){
        return {}
    }
    async delete(){
        return {}
    }     
}
export {Network,Http}