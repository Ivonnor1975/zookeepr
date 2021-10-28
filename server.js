const express = require('express');
const fs = require('fs');
const path = require('path');

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

function filterByQuery(query, animalsArray){
    let personalityTraitsArray = [];
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
}

//retunr animal by Id
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
  }
//unction that accepts the POST route's req.body value and the array we want to add the data to. 
  function createNewAnimal(body, animalsArray) {
    console.log(body);
    // our function's main code will go here!
  
    // return finished code to post route for response
    return body;
  }

// to create a route that the front-end can request data from
const { animals } = require('./data/animals');
app.get('/api/animals', (req, res) => {
   let results = animals;
   if (req.query){
       results = filterByQuery(req.query, results); 
   }
   res.json(results);
  });

// to create a route for a single animal object
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result){
      res.json(result);//send data back to the client
    }else{
        res.send(404); //object not found
    }
  });
//to create a route to Post or accept data to save on server
app.post('/api/animals', (req, res) => {
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
  //write the new animal on the array
  function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
      path.join(__dirname, './data/animals.json'),
      JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return animal;
  }
  // validate data
  function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }
  //to create a route to serve index.html
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  //to create a route to serve animals.html
  app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
  });
  //to create a route to serve zookeepers.html
  app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
  });
 //to create a wildcard route to serve when there's no route that matches
 //the * route should always come last.
   app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });  
//To make our server listen
app.listen(PORT, () =>{
    console.log(`API server now on port ${PORT}!`);
});