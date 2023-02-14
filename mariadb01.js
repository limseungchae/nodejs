const mariadb = require('mariadb');
const dbconfig = require('./dbconfig2');
const oracledb = require("oracledb");

async function main() {
    const sql = ' select distinct sido from zipcode2013 ';

    let conn = null;

    try {
        conn = await mariadb.createConnection(dbconfig);

        let result = await conn.execute(sql);
        // console.log(result);

        for(let row of result) {
            console.log(row.sido);
        }

    } catch (ex) {
        console.error(ex)
    } finally {
        if (conn) {
            try { await conn.close(); }
            catch (ex) {
                console.error(ex);
            }
        }
    }
}; // main

main();