
import alasql from '../lib/alasql.js';
import { Data } from './data.js';
import  {DataBase, Table } from './database.js';
class RDB extends DataBase{
    name;
    constructor(name){
        super()
        this.name = name;
    }

    sql(){

    }
}

class ALSQLTABLE extends Table{
    constructor(dbName,name){
        super(dbName,name)
    }
    async create(fields){
        this.debugger.log('creating table',`${this.dbName}.${this.name}`)
        await alasql(`CREATE TABLE IF NOT EXISTS ${this.dbName}.${this.name} ${fields}`)
    }

    insert(data){
        alasql(`SELECT * INTO ${this.dbName}.${this.name} FROM ?`, [data]);
    }

    static select(table,fields,where,orderby,groupby){
        return alasql(`SELECT ${fields||"*"} FROM ${table.dbName}.${table.name}`)
    }

    
}
class ALSQLDB extends RDB{
    location
    constructor(location,name){
        super(name)
        this.location = location
    }
    async create(){
        this.debugger.log('creating DB')
        await alasql(`CREATE ${this.location} DATABASE IF NOT EXISTS ${this.name}`);
    }

    async createTable(tableName,tableFields){
        
        let t=new ALSQLTABLE(tableName)
        await t.create(tableFields)
        return t
    }


    executeSQL(sql){
        alasql('CREATE TABLE IF NOT EXISTS MyAtlas.City (city string, population number)');
        alasql('SELECT * INTO MyAtlas.City FROM ?', [[
            { city: 'Vienna', population: 1731000 },
            { city: 'Budapest', population: 1728000 }
        ]]);
        var res = alasql('SELECT * FROM MyAtlas.City');
    }   

    
}
class ALASQL {

    static async createDB(location,name){
        let db = new ALSQLDB(location,name)
        await db.create()
        return db
    }
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

class SQLLite {

}
export {SQLLite,ALASQL}