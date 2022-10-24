const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const FuelShed = require('../models/fuelShed');

exports.signup = async (req, res, next) => {
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
    const NIC = req.body.NIC;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hashedPw = await bcrypt.hash(password, 12);

        const fuelShed = new FuelShed({
            stationName,
            adminName,
            NIC,
            email,
            password: hashedPw,
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

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            success: true,
            token: token,
            userId: loadedUser._id.toString() ,
            type: loadedUser.type,
            name:loadedUser.name
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};