# iGotha: A Simple and Scalable Chat Application

iGotha is an open-source chat application designed for seamless communication. It supports user registration, authentication, and chat functionality, making it ideal for personal or collaborative use. Whether you're a developer looking to contribute or a user exploring its features, iGotha is easy to set up and use.

## Table of Contents

- [Overview](#igotha-a-simple-and-scalable-chat-application)
- [Table of Contents](#table-of-contents)
- [Structure](#structure)
- [Key features](#key-features)
- [Frontend](#frontend)
  - [Component](#components)
  - [Frontend Installation](#frontend-installation)
- [Backend](#backend)
  - [Structure](#structure)
  - [Route Overview](#route-overview)
  - [Routes Test](#routes-test)

  - [Authentication Routes (auth.route.js)](#authentication-routes-authroutejs)
  - [User Routes (user.route.js)](#user-routes-userroutejs)
- [License](#license)

## Structure

```bash
iGotcha/
  └── frontend/
  └── backend/
  └── CODE_OF_CONDUCT.md
  └── CONTRIBUTING.md
  └── LICENSE
  └── README.md
  └── .gitignore
  └── .github/
```

## Key Features

- **Real-time Messaging**: Chat with users or groups in real-time.
- **User Authentication**: Secure login and registration system.
- **Group Chats**: Create and manage group conversations effortlessly.
- **Scalability**: Built using modern technologies like React, Redux, Node.js, and Sequelize for scalability and performance.

## Frontend

The frontend is built using React and Redux. It provides a user interface for user registration, login, and chat functionality. The frontend is organized into the following components:

### Components

The frontend components are organized as follows:

```bash
iGotcha/
  └── frontend/
  ├── src/
  │   ├── components/
  │   │   ├── Chat.js
  │   │   ├── ChatInput.js
  │   │   ├── ChatList.js
  │   │   ├── LoginForm.js
  │   │   ├── RegisterForm.js
```

### Frontend Installation

1. **Clone the repository and Navigate to directory**:

   ```bash
   git clone <https://github.com/rohteemie/iGotha.git>

   cd <frontend>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory and add the following environment variables**:

  ```bash
  API_ENDPOINT=localhost:8000

  npx dev start
  ```

  You can now access the iGotha page at `http://localhost:8000`

## Backend

This backend is built using node.js. It provides a user interface for user registration, login, and chat functionality. The frontend is organized into the following components:

### Backend Installation

1. **Clone the repository**:

   ```bash
   git clone <https://github.com/rohteemie/iGotha.git>

   cd <backend>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start MySQL**:

  ```bash
  # First check to see if mysql is installed on your local machine.

    mysql --version
  ```

  **If mysql is not installed, Kindly reference the following link to install mysql on your local machine: [Install MySQL](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/)**

   ```bash
   # If mysql is installed,
   # Start MySQL on your local machine using the following command:

   sudo service mysql start
   ```

   ```bash
   # sign in to mysql

   mysql -u root -p

   # Enter your MySQL password when prompted.
   ```

   ```sql
   mysql> SHOW DATABASES;
   ```

   You should see a list of databases and select the preferable one to use,
   otherwise you will have to create a new one using the command below assuming
   you want to name the database **testDB**

  ```sql
  /* Command to create the database. */

  CREATE DATABASE testDB;
  ```

  ```sql
   /* Exit the MySQL shell. */

   mysql> exit;
  ```

---

1. **Set the environment variables**:

  Create a `.env` file in the iGotha/backend directory and add the following environment variables:

   `DB`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_DIALECT` environment variables in the `.env` file.

  ```bash
  DB=testDB
  DB_USER=dbUser
  DB_PASSWORD=dbPassword
  DB_HOST=localhost
  DB_DIALECT=mysql

  JWT_SECRET=secret
  EXPIRE_IN=1h

  ```

  Replace `testDB`, `dbUser`, and `dbPassword` with your MySQL database name, username, and password respectively.

2. **Run the migrations**:

   Run the migrations to create the necessary tables in the database.

   ```bash
   npx sequelize-cli db:migrate
   ```

3. **Start the server**:

   ```bash
   npm start
   ```

4. **Access the API**:

   You can now access the API at `http://localhost:3000`.

---

### Structure

The backend routes are organized as follows:

```bash
iGotcha/
    └── backend/
        ├── models/
        ├── services/
        ├── routes/
        ├── middleware/
        ├── config/
        ├── helper/
        ├── tests/
        ├── websocket/
```

### Route Overview

This backend provides the following routes:

| Route Path        | HTTP Method | Description                   |
|-------------------|-------------|-------------------------------|
| `/auth/login`     | POST        | Logs in a user                |
| `/user`           | GET         | Fetches all users             |
| `/user/create`    | POST        | Registers a new user          |
| `/user/:username` | GET         | Fetches a user by username    |
| `/user/:username` | PUT         | Updates a user by username    |
| `/chat/`          | GET         | Fetches all chats by users    |
| `/chat/create`    | POST        | Create a new chat             |
| `/chat/:chatId`   | GET         | Fetches a chat using it ID    |
| `/group/`         | POST        | Create a new group            |
| `/group/`         | GET         | Fetches all the group info    |
| `/group/:groupId` | GET         | Fetches group info using it ID|
| `/group/:groupId` | POST        | Post messages to a group by ID|
| `/group/add`      | PUT         | Use to add a user to a group  |

### Routes Test

Authentication Routes (auth.route.js)
File Path: /home/fin/backend/routes/auth.route.js

Description: This file contains routes for user authentication.
Endpoints

Login User
URL: /auth/login
Method: POST
Description: Authenticates a user and returns an access token upon successful login.
Controller Function: auth.login
Example:
json
Copy code
{
  "email": <user@example.com>,
  "password": "password123"
}

User Routes (user.route.js)
File Path: /home/fin/backend/routes/user.route.js
Description: This file contains routes for user operations such as fetching, creating, and updating user information.
Endpoints

Get All Users
URL: /user
Method: GET
Description: Retrieves a list of all registered users.
Controller Function: user_service.getAllUsers

Create a New User
URL: /user/create
Method: POST
Description: Registers a new user in the system.
Controller Function: user_service.registerUser
Example:
json
Copy code

```bash
{
"username": "newuser",
"email": <newuser@example.com>,
"password": "securePassword123"
}
```

Get User by Username
URL: /user/:username
Method: GET
Description: Fetches a specific user's details using their username.
Controller Function: user_service.getUserName

Update User by Username
URL: /user/:username
Method: PUT
Description: Updates information for a specific user identified by their username.
Controller Function: user_service.updateUser
Example:
json
Copy code

```bash
{
"email": <updatedemail@example.com>
}
```

Notes
Middleware: Authentication and validation middlewares should be implemented as needed.
Error Handling: All routes should have error handling to manage invalid input and server errors.
License
This project is licensed under the MIT License - see the LICENSE file for details.

## LICENSE

Kinldy refer to the license page here: [LICENSE](https://github.com/rohteemie/igotha?tab=MIT-1-ov-file)

## CONTRIBUTION
