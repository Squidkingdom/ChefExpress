/*
  Express server setup for handling API requests.
  This file initializes an Express server, configures middleware, 
  and starts the server to listen on a specified port.
  
  Programmer: Blake, Ike, Brady
  Date Created: 11/1/24
  Last Revised: 11/1/24
*/

// Importing required modules
import express, { Request, Response } from 'express'; // Express framework for building the app
import log4js from 'log4js'; // Logger for tracking events
import api from './routes/api'; // API routes for the application
import bodyParser from 'body-parser'; // Middleware for parsing incoming request bodies
import cors from 'cors'; // Middleware to enable Cross-Origin Resource Sharing

// Create a logger for the file index.ts
var log = log4js.getLogger('index.ts');

// Create express app instance
const app = express();

// Define the port number the server will listen to
const port = 3000;

// Middleware to parse JSON data in request bodies
app.use(bodyParser.json());

// CORS middleware to allow requests from all origins
app.use(cors({
  origin: '*' // Allows all origins to send requests to the server
}));

// Register the API routes under '/api'
app.use('/api', api);

// Enable CORS for all requests using cors middleware
// This is already set up above as part of the middleware

// Start the Express server and listen on the specified port
app.listen(port, async () => {
  // Output a message when the server successfully starts
  console.log(`Server listening on port ${port}`);
});