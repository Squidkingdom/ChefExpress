/**
 * Name: index.js
 * Description: Main file of the Express-based backend server. It sets up the Express app and starts the server, with a basic route to respond to GET requests at the root URL.
 * Programmer's name: Auto-generated
 * Date the code was created: 11/24/24
 * Date the code was revised: 11/24/24
 * Preconditions:
 *   - Node.js environment must be installed and properly configured.
 * Acceptable input values or types:
 *   - GET request to the root URL ('/').
 * Postconditions:
 *   - Server listens on port 3000 and responds to GET requests at the root URL.
 * Return values or types:
 *   - For a GET request to the root URL, the server returns a 'Hello World' message.
 * Error and exception condition values:
 *   - None explicitly handled.
 * Side effects:
 *   - Starts the Express server on the specified port (3000).
 * Invariants:
 *   - The server always listens on port 3000 unless configured otherwise.
 * Known faults:
 *   - None explicitly mentioned.
 */

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Main file of Express based backend server
const express_1 = __importDefault(require("express"));
// create express app
const app = (0, express_1.default)();
const port = 3000;
// for queries to the root URL, send a response of 'Hello World'
app.get('/', (req, res) => {
    res.send('Hello World');
});
// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
