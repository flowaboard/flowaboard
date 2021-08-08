import { Data } from "./data";
import { Octokit, App } from "https://cdn.skypack.dev/octokit";
class DataBase extends Data{
    insert(){

    }
    update(){

    }
    delete(){

    }
}
class GitStorage extends DataBase{
    constructor(){
    }

    login(type){
        switch (type) {
            case 'Personal Access Token':
                this.loginByPersonalAccessToken()
                break;
        
            default:
                break;
        }
    }

    loginByPersonalAccessToken(){
        console.log(Octokit)
        const auth = createTokenAuth("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");
        const { token } = await auth();
        console.log(token)
    }
    
    
}
export {GitStorage}