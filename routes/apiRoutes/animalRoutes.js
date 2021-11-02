//we cannot use app any longer, because it's defined in the server.js 
//Router, which allows you to declare routes in any file as long as you use the proper middleware.
const router = require('express').Router();

//import modules from animals library
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');

// to create a route that the front-end can request data from
const { animals } = require('../../data/animals');

router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query){
        results = filterByQuery(req.query, results); 
    }
    res.json(results);
   });

// to create a route for a single animal object
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result){
      res.json(result);//send data back to the client
    }else{
        res.send(404); //object not found
    }
  });

  //to create a route to Post or accept data to save on server
router.post('/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
            res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
  });

  module.exports  = router;