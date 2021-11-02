const express = require('express');
//The require() statements will read the index.js files in each of the directories indicated
//the index.js file will be the default file read if no other file is provided
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const fs = require('fs');


//We're going to tell our app to use that port, if it has been set, and if not, default to port 80.
const PORT = process.env.PORT || 3001;
//To instantiate the server
const app = express();

//Make certain files readily available. instruct the server to make these files static resources. 
app.use(express.static('public'));

// parse incoming string or array data
// app.use mounts a function middleware
// It takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body 
app.use(express.urlencoded({ extended: true })); 
// parse incoming JSON data
app.use(express.json()); 

//ny time a client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes
app.use('/api', apiRoutes);
//If / is the endpoint, then the router will serve back our HTML routes.
app.use('/', htmlRoutes);
   
//To make our server listen
app.listen(PORT, () =>{
    console.log(`API server now on port ${PORT}!`);
});