const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const customerModel = require('../models/customer.model');

dotenv.config();

const router = new express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.route('/generateToken').post(async (req, res)=>{
    const body = req.body;

    var customer = await Customer.findOne({email: body.email});
    if(!customer) {
        res.status(401).send(JSON.stringify({'message': 'No such email'}));
        return;
    }
    if(customer.password !== body.password) {
        res.status(401).send(JSON.stringify({'message': 'Credentials mismatched'}));
        return;
    }
    const payload = { email: customer.email, id: customer._id, name: customer.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    return res.status(200).json({ message: 'Authenticated', token });
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
};

router.route('/validateToken').get(verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid', user: req.user });
});

module.exports = router;