import { Data } from "./data";
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
import { createTokenAuth } from "https://cdn.skypack.dev/@octokit/auth-token";
class DataBase extends Data{
    insert(){

    }
    update(){

    }
    delete(){

    }
}
class GitStorage extends DataBase{
    token;
    constructor(){
    }

    login(type,creds){
        switch (type) {
            case 'Personal Access Token':
                this.loginByPersonalAccessToken(creds.token)
                break;
        
            default:
                break;
        }
    }

    loginByPersonalAccessToken(token){
        console.log(Octokit)
        const auth = createTokenAuth(token);
        const { token } = await auth();
        this.token = token;
        console.log(token)
    }
    
    
}
class ALASQL extends DataBase {
    static createTable() {
        alasql("CREATE TABLE example1 (a INT, b INT)");

        // alasql's data store for a table can be assigned directly
        alasql.tables.example1.data = [
            { a: 2, b: 6 },
            { a: 3, b: 4 }
        ];

        // ... or manipulated with normal SQL
        alasql("INSERT INTO example1 VALUES (1,5)");

        var res = alasql("SELECT * FROM example1 ORDER BY b DESC");

        console.log(res); // [{a:2,b:6},{a:1,b:5},{a:3,b:4}]

        alasql('CREATE localStorage DATABASE IF NOT EXISTS Atlas');
        alasql('ATTACH localStorage DATABASE Atlas AS MyAtlas');
        alasql('CREATE TABLE IF NOT EXISTS MyAtlas.City (city string, population number)');
        alasql('SELECT * INTO MyAtlas.City FROM ?', [[
            { city: 'Vienna', population: 1731000 },
            { city: 'Budapest', population: 1728000 }
        ]]);
        var res = alasql('SELECT * FROM MyAtlas.City');
        console.log(res);
    }
}

export {GitStorage,ALASQL}