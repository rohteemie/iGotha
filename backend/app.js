const express = require("express")
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');
const auth = require('./routes/auth.route');
const user = require('./routes/user.route');
const group = require('./routes/group.route');
const message = require('./routes/message.route');
const chat = require('./routes/chat.route');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require("dotenv").config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:true}))
app.use(cors())
// swaggerDocs(app)

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'iGotcha App',
        version: '1.0.0',
        description: 'iGotcha App Documentation',
        },
        servers: [
        {
            url: true ? "/" : "/",
            description: 'Development server',
        },
        ],
        // paths: swaggerAnnotation,
        tags: [
            { name: 'Auth', description: 'Endpoints related to authentication function' },
            { name: 'User', description: 'Endpoints related to user function' },
        ]
    },
    apis: ["./app.js"],
};
const setup = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(setup));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )

    if(req.method == "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    }
    next()
})

app.get("/", (req, res) => {
    res.status(200).json({
        message : "Hi, Welcome to iGotha chat app.",
        version : "1.0",
        author : "Rotimi and Ajiboye"
    })
})

app.use('/user', user);
app.use('/auth', auth);
app.use('/group', group);
app.use('/message', message);
app.use('/chat', chat);

app.use((req, res) => {
    res.status(404).json({
        message : "Endpoint not found"
    })
})


module.exports = app

// users
/**
* @swagger
* /user/create:
*   post:
*     tags: [User]
*     summary: Create a new user
*     description: |
*       This endpoint allows you to create a new user account.
*       To create a user, you must provide the following information:
*
*       - first_name: The email address of the user. This field is required.
*       - last_name: The email address of the user. This field is required.
*       - username: The username of the user. This field is required.
*       - email: The email address of the user. This field is required.
*       - password: The password for the user account. This field is required.
*
*       Upon successful creation, the endpoint returns a response with status code 201 (Created).
*     requestBody:
*       description: User object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               first_name:
*                 type: string
*               last_name:
*                 type: string
*               username:
*                 type: string
*               email:
*                 type: string
*               password:
*                 type: string
*             required:
*               - first_name
*               - last_name
*               - username
*               - email
*               - password
*     responses:
*       201:
*         description: User created successfully
*/

/**
* @swagger
* /user/:username:
*   put:
*     tags: [User]
*     summary: Update a user
*     description: |
*       This endpoint allows you to update a user account.
*       To update a user, you must provide either or all the following information:
*
*       - first_name: The email address of the user. This field is required.
*       - last_name: The email address of the user. This field is required.
*       - username: The username of the user. This field is required.
*       - email: The email address of the user. This field is required.
*       - password: The password for the user account. This field is required.
*
*       Upon successful creation, the endpoint returns a response with status code 200 (okay).
*     requestBody:
*       description: User object
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id:
*                 type: string
*               firstname:
*                 type: string
*               lastname:
*                 type: string
*               email:
*                 type: string
*               username:
*                 type: string
*               phone:
*                 type: string
*             required:
*               - id
*     responses:
*       200:
*         description: User updated successfully
*/

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: |
 *       This endpoint allows users to log in to their accounts.
 *       To authenticate, users must provide their email and password.
 *
 *       - email: The email address of the user. This field is required.
 *       - password: The password for the user account. This field is required.
 *
 *       Upon successful authentication, the endpoint returns a response with status code 200 (OK) along with an authentication token.
 *
 *     requestBody:
 *       description: User object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 */


/**
 * @swagger
 * /user:
 *   get:
 *     tags: [User]
 *     summary: Get all user
 *     description: |
 *       This endpoint allows to fetch all users on the platform.
 *
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User fetch successfully
 */
