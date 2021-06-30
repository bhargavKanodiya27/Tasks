var express = require('express');
const sequelize =require('./connection');
const Sequelize = require('sequelize');
const User = require('./Models/user');
const basic_routes = require('./Routes/basic_routes');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); 
//app.use(User)
app.use('/', basic_routes);

sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })

sequelize
.sync()
.then(result=>{
  //  console.log(result)
    app.listen(3000)
})        
.catch(err=>{
    console.log(err)
})


  
// app.listen(3000, function () {
//     console.log('Test app listening on port 3000!');
// });