
import * as alaSQLSpace from '../lib/alasql/alasql.js';
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

class SQLLite extends DataBase {

}
export {SQLLite,ALASQL}