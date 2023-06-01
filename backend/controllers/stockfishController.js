import { connection } from '../models/mysql/database.mjs';

async function query(query, values) {
    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(query, values, (error, results, fields) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        return results;
    } catch (error) {
        console.log(error);
        return "ERROR";
    }
}
