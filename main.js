// Import Express.js function
const express = require('express');

const app = express();

// Import and configure .env variables
require('dotenv').config(); 

// Define Port (with a default value)
const port = process.env.PORT;

// Load CORS library
const cors = require('cors');

app.use(cors()); // Enable CORS
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data

// Define routes
app.get('/', (req, res) => {
    res.send(`<center>
        <h1>Welcome to Express Server</h1>
        <a href='http://localhost:${port}/api/food/all'>Food Items</a>
        </center>`);
});

// Import Router
const foodRouter=require('./routes/food.routes')
app.use('/api/food/',foodRouter);

// Start the server
app.listen(port, () => {
    console.log(`Backend started at http://localhost:${port}/`);
});
