import express, { Request, Response } from 'express';
import log4js from 'log4js';
import api from './routes/api';
import bodyParser from 'body-parser';
import cors from 'cors';

// Create a logger for the file index.ts
var log = log4js.getLogger('index.ts');

// Create express app
const app = express();
const port = 3000;



app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));
// app.use(log4js.connectLogger(log, { level: 'auto' }));
app.use('/api', api);

// Enable CORS for all requests using cors middleware


// Start the server
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
});
