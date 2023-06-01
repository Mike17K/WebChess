import mysql from 'mysql';
import { config } from 'dotenv';

config();

export let connection;

if (process.env.PRODUCTION == 1) {
  // when using docker-compose use the docker container db
  connection = mysql.createConnection({
    host: 'db',
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD
  });
  connection.config.charset = 'utf8mb4';

} else {
  // use the local instanse of mysql
  connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'WebChessDb',
    password: 'password'
  });
  connection.config.charset = 'utf8mb4';

}


export function connect() {
  let connected = false;
  let tryingtoconnect = false;

  connection.connect((err) => {
    if (err) {
      connected = false;
      tryingtoconnect = false;
      console.error('Failed to connect to the database:', err);
    } else {
      connected = true;
      console.log('Connected successfully to the database');
    }

  }
  );
}

export function disconnect() {
  // Close the connection
  connection.end();
}
