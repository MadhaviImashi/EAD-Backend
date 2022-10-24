const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const shedOwnerAuthRoutes = require('./routes/stationAuth');
const fuelStationRoutes = require('./routes/FuelManagement');
require('dotenv').config();

const app = express();

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/auth', authRoutes); 
// https://eadfuelapp.herokuapp.com/api/auth/register                   [POST]

app.use('/api/auth/shed-owner', shedOwnerAuthRoutes);
// https://eadfuelapp.herokuapp.com/api/auth/shed-owner/register        [POST]

app.use('/api/fuel-station', fuelStationRoutes);
// https://eadfuelapp.herokuapp.com/api/fuel-station/                   [GET]
// https://eadfuelapp.herokuapp.com/api/fuel-station/search             [GET]
// https://eadfuelapp.herokuapp.com/api/fuel-station/update             [POST]
// https://eadfuelapp.herokuapp.com/api/fuel-station/add-to-queue       [POST]
// https://eadfuelapp.herokuapp.com/api/fuel-station/q-lengths          [GET]
// https://eadfuelapp.herokuapp.com/api/fuel-station/q-waiting-times    [GET]
// https://eadfuelapp.herokuapp.com/api/fuel-station/fuel-avaiability   [GET]
// https://eadfuelapp.herokuapp.com/api/fuel-station/exit-queue         [POST]
// https://eadfuelapp.herokuapp.com/api/fuel-station/exit-after-pump    [POST]

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(
        process.env.CONNECTION_URL,
    )
    .then(result => {
        console.log('connected to DB');
        const server = app.listen(process.env.PORT || 4000);
        console.log(`Server started on port ${server.address().port}`);
    })
    .catch(err => console.log(err));