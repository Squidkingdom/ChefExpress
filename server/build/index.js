"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Main file of Express based backend server
const express_1 = __importDefault(require("express"));
//create express app
const app = (0, express_1.default)();
const port = 3000;
// for queries to the root URL, send a response of 'Hello World'
app.get('/', (req, res) => {
    res.send('Hello World');
});
//Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
