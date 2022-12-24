import { StorageSystem } from "./storage.js";

import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
import { createTokenAuth } from "https://cdn.skypack.dev/@octokit/auth-token";

class GitStorage extends StorageSystem{
    token;
    constructor(){
    }

    async login(type,creds){
        switch (type) {
            case 'Personal Access Token':
                return await this.loginByPersonalAccessToken(creds.token)
                break;
        
            default:
                break;
        }
    }

    async loginByPersonalAccessToken(pat){
        console.log(Octokit)
        const auth = createTokenAuth(pat);
        const { token } = await auth();
        this.token = token;
        console.log(token)
    }
    
    
}

export {GitStorage}