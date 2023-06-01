### Run

With docker compose we are making it easy just have docker installed and running
and type the following command after cloning the project to your machine

```
$ docker-compose build
$ docker-compose up
```

and to stop it

```
$ docker compose down
```

### if u dont have docker

u have to have a local mysql database running with the name **WebProjectDb** and
a table users as defined in the /config/db_setup.sql

To run the program

```
node .\app.js
```

Its importand to have installed latest the
latest node in the local system .
I am using the v18.15.0

### Info About Handlebars

Layouts are the most ambiguous high-level layer; these are commonly used to set underlying page metadata as well as general layout (for lack of a better term).

Pages are templates which equate to one type of page. For example, the 'post' page on this site is unique from, say, the homepage. Because all posts share elements with one another, hundreds of posts share this same template.

Partials are snippets which can be shared between pages, such as navigation.

A Context is content which is passed to templates and result in being the page's content

Helpers are the closest we get to logic in Handlebars: these allow us to display or omit content based on conditionals such as if statements. For example: showing an author's avatar only if they have uploaded an image.

## Trubleshooting

error: Client does not support authentication protocol requested by server; consider upgrading MySQL client

solution:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;

## Dockerize

### Build The Image

```
docker build -t web-project .

```

### Run Container

```
docker run -d -p 3000:3000 web-project
```

```
docker exec -it {containerid} /bin/sh
```

### Create Network

create the network

```
docker network create my-network
```

running the sql container

```
docker run -d --name mysql-container --network my-network -e MYSQL_ROOT_PASSWORD=password mysql:latest
```

run the container of the express

```
docker run -d --name my-app-container --network my-network my-app-image:latest
```

Create a connection to the database with using the container of the sql

const connection = mysql.createConnection({
host: 'mysql-container', // name of the MySQL container in the network
port: 3306, // default MySQL port
user: 'root',
password: 'password',
database: 'WebProjectDb'
});

with .env

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=mydatabase

require('dotenv').config();

const connection = mysql.createConnection({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME
});
