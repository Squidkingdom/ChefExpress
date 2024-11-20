//Main file of Express based backend server
import express, {Request, Response} from 'express';
import log4js from 'log4js';
import api from './routes/api'
import bodyParser from 'body-parser';

//Create a logger for the file index.ts
var log = log4js.getLogger('index.ts');


//create express app
const app = express();
const port = 3000;

app.use(bodyParser.json());
// app.use(log4js.connectLogger(log, { level: 'auto' }));
app.use('/api', api);


//Start the server
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
});