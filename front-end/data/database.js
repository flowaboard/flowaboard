import { Data } from "./data.js";

class Row {

}

class Table extends Data {
    name;
    dbName;
    constructor(dbName,name) {
        super()
        this.dbName = dbName;
        this.name = name;
    }
    insert() {

    }

    update() {

    }

    delete() {

    }
    static join() {

    }
}

class DataBase extends Data {
    constructor() {
        super()
    }

    createTable() {

    }

    dropTable() {

    }

    alterTable() {

    }

    truncte() {

    }


}

export { DataBase, Table, Row }