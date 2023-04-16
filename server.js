// Importing all the necessery modules.
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// importing all the routes.

const routes = require('./routes/routes');

// initializing the app from express.
const app = express();
// initializing the middleware to parses json.
app.use(express.json());

// Importing the port number and database link from the .env file.
const port = process.env.PORT;
let db_link;

if (process.env.NODE_ENV === 'test') {
    console.log("TEST ENVIRONMENT");
    db_link = process.env.TEST_DB_LINK
} else db_link = process.env.DB_LINK;

// Connecting the database.
mongoose.connect(db_link, { useUnifiedTopology: true, useNewUrlParser: true })
    .catch((error) => {
        console.error(error)
    });
mongoose.connection.once('open', () => console.log('Connected succesfully to MongoDB link', db_link));




// Middleware to log requests.
app.use((req, res, next) => {
    const { rawHeaders, httpVersion, method, socket, url } = req;
    console.log('Request Time:', new Date().toUTCString());
    console.log({ rawHeaders, httpVersion, method, url });
    next()
})

// Routes to all the API'S.
app.use('/api', routes);



app.listen(port, () => {
    console.log("listening on port", port)
});

module.exports = app;

