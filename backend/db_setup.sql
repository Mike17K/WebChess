CREATE DATABASE IF NOT EXISTS WebChessDb;
USE WebChessDb;
DROP table IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255),
    icon int not null default 1
);
-- USER PRIVILEGES
ALTER USER 'root' @'localhost' IDENTIFIED BY 'password';
create user 'client1' @'%' identified with mysql_native_password by 'password';
grant all privileges on *.* to 'client1' @'%';
flush privileges;
INSERT INTO users (
        id,
        name,
        password
    )
VALUES (
        1,
        "admin",
        "password"
    );