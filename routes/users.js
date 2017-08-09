const express = require('express');
const router = express.Router();
const userModel = require('../models/user_model');
const commonMessage = require('../configs/common_messages.json');
const validator = require('../utilities/string_validator');


router.post('/', async(req, res) => {
    let entity = req['body']['entity'];
    let password = req['body']['password'];
    if(entity === undefined || password === undefined)
        res.status(200).send(commonMessage.body_body_empty);
    else {
        let isEmail = validator.validateEmail(entity);
        res.status(200).send(isEmail);
    }
});

module.exports = router;
