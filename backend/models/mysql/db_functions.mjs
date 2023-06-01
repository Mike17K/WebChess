import { connection } from './database.mjs';


export async function validateUser({ username, password }) {
  "  Validate user by name and password  "
  return await new Promise((resolve, reject) => {
    connection.query('SELECT name,password FROM users', (err, results, fields) => {
      if (err) {
        console.error('Failed to execute query:', err);
        reject(err);
      } else {
        let authorized = false;
        //console.log('Query results:', results);
        results.forEach(result => {
          if (result.name == username && result.password == password) {
            authorized = true;
          }
        });
        resolve(authorized);
      }
    });
  });
}

export async function addUser(name, password, icon) {
  return await new Promise((resolve, reject) => {
    const sql = `INSERT INTO users (name, password,icon) VALUES (?, ?, ?)`;
    const values = [name, password, icon];
    connection.query(sql, values, (error, results, fields) => {
      if (error) {
        console.error('Error adding user.');
        reject(err);
      }
      console.log('User added successfully.');
      resolve(true);
    });
  });
}

export async function deleteUser(id) {
  return await new Promise((resolve, reject) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    const values = [id];
    connection.query(sql, values, (error, results, fields) => {
      if (error) {
        console.error('Error deleting user.');
        reject(err);
      }
      console.log('User deleted successfully.');
      resolve(true);
    });
  });
}
