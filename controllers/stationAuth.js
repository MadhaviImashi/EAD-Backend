const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const FuelShed = require('../models/fuelShed');

exports.signup = async (req, res, next) => {
    let isPetrol, isDiesel;

    console.log('req', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const stationName = req.body.stationName;
    const adminName = req.body.adminName;
    const email = req.body.email;
    const password = req.body.password;
    const petrol = req.body.isPetrol;
    const diesel = req.body.isDiesel;

    //convert petrol and diesel into boolean values
    if (petrol === "true") {
        isPetrol = true;
    } else {
        isPetrol = false;
    }

    if (diesel === "true") {
        isDiesel = true;
    } else {
        isDiesel = false;
    }
    
    try {
        const hashedPw = await bcrypt.hash(password, 12);

        const fuelShed = new FuelShed({
            stationName,
            adminName,
            email,
            password: hashedPw,
            type: "shed",
            isPetrol,
            isDiesel
        });
        const result = await fuelShed.save();
        res.status(201).json({ success: true, message: 'FuelShed created!', fuelShedId: result._id, result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
