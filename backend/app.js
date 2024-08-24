#!/usr/bin/env node
const express = require('express');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');



const app = express();

app.get('/', (req, res) => {
  res.send({message: 'Hello World!'});
});


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});