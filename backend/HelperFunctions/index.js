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


// Helper Functions
export function validateObj(obj, fields = []) {
    // This function checks for fields in the request
    let containsAllFields = true;
    let notFoundFields = [];
    fields.forEach(field => {
        if (obj[field] === undefined) {
            containsAllFields = false;
            notFoundFields.push(field);
        }
    })
    if (containsAllFields) {
        return true;
    } else {
        console.log("Not found fields: ", notFoundFields);
        return false;
    }
}
