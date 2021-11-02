const path = require('path');
//we cannot use app any longer, because it's defined in the server.js 
//Router, which allows you to declare routes in any file as long as you use the proper middleware.
const router = require('express').Router();

//to create a route to serve index.html
 router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });
  //to create a route to serve animals.html
 router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
  });
  //to create a route to serve zookeepers.html
 router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
  });
 //to create a wildcard route to serve when there's no route that matches
 //the * route should always come last.
 router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  module.exports = router;