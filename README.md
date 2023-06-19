# A FULL STACK APP FOR CHESS

Using Prisma,mySQL,Express,React,Redux,tailwind i am building this project about organizing chess tactics and solving them baced of the data of a book.

# Views

![Tactics Page View](/frontend/public/screenshots/tacticsPage.png)

The tactics page is the current main page of the project in the local path [/tactics](http://localhost:3000/tactics).

![Admin Page View](/frontend/public/screenshots/adminPage.png)

The admin page for now is on the local path [/admin](http://localhost:3000/admin).

# TO RUN

- clone the project localy
- create a mysql connection and write the connection string to a .env file in the backend folder, in a variable of name DATABASE_URL ex: DATABASE_URL="mysql://root:password@localhost:3306/WebChessDb?schema=public"
- cd into the backend folder
- npm install
- npm start
- in another terminalc cd into the frontend folder
- npm install
- npm start

The project should run on http://localhost/tactics
