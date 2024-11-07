//Main file of Express based backend server
import express from 'express';

//create express app
const app = express();
const port = 3000;

// for queries to the root URL, send a response of 'Hello World'
app.get('/', (req, res) => {
  res.send('Hello World');
});

//Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});