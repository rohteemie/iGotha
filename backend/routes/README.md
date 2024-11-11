# Backend API Routes Documentation

This repository contains the application routes for handling user authentication, user-related operations, messages and chat operations. Each route is structured to follow RESTful principles, allowing for a clean and modular approach to API development.

## Table of Contents

- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Route Overview](#route-overview)
- [Routes](#routes)
  - [Authentication Routes (`auth.route.js`)](#authentication-routes-authroutejs)
  - [User Routes (`user.route.js`)](#user-routes-userroutejs)

---

## Installation

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

   Start MySQL on your local machine.

   ```bash
   mysql -u root -p
   ```

   Enter your MySQL password when prompted.

   ```sql
   mysql> show databases;
   ```

   You should see a list of databases.

   ```sql
   mysql> exit;
   ```

   Exit the MySQL shell.

4. **Create a database**:

   Create a MySQL database and update the `DB`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_DIALECT` environment variables in the `.env` file.

   ```sql
   CREATE DATABASE testDB;
   ```

5. **Set the environment variables**:

  Create a `.env` file in the root/back directory and add the following environment variables:

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

6. **Run the migrations**:

   Run the migrations to create the necessary tables in the database.

   ```bash
   npx sequelize-cli db:migrate
   ```

7. **Start the server**:

   ```bash
   npm start
   ```

8. **Access the API**:

   You can now access the API at `http://localhost:3000`.

---

## Folder Structure

The backend routes are organized as follows:

```bash
iGotcha/
    └── backend/
        ├── routes/
        │   ├── auth.route.js
        │   └── user.route.js
```

## Route Overview

This backend provides the following routes:

| Route Path        | HTTP Method | Description                   |
|-------------------|-------------|-------------------------------|
| `/auth/login`     | POST        | Logs in a user                |
| `/user`           | GET         | Fetches all users             |
| `/user/create`    | POST        | Registers a new user          |
| `/user/:username` | GET         | Fetches a user by username    |
| `/user/:username` | PUT         | Updates a user by username    |

## Routes

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
