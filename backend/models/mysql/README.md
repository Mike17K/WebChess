# Set up database container

https://medium.com/@kelvinekrresa/mysql-client-does-not-support-authentication-protocol-6eed9a6e813e

```
docker pull mysql/mysql-server:latest
docker images
docker run -p 3306:3306 --name=mysql_container -d mysql/mysql-server
```

Find the root password of the mysql search in the logs of the container for **GENERATED_ROOT_PASSWORD** with

```
docker logs mysql_container
```

Then log in the mysql inside the container

```
docker exec -it mysql_container bash
mysql -uroot -p
```

its going to ask for password copy and paste the GENERATED_ROOT_PASSWORD in and hit enter

now u are loged in the mysql shell
change the root password

```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';

create user 'client1'@'%' identified with mysql_native_password by 'password';
grant all privileges on *.* to 'client1'@'%';
flush privileges;
```

# Execute queries

SHOW DATABASES;
