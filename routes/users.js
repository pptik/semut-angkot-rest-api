const express = require('express');
const router = express.Router();
const userModel = require('../models/user_model');
const commonMessage = require('../configs/common_messages.json');
const validator = require('../utilities/string_validator');
const md5 = require('md5');


router.post('/login', async(req, res) => {
    let entity = req['body']['entity'];
    let password = req['body']['password'];
    if(entity === undefined || password === undefined)
        res.status(200).send(commonMessage.body_body_empty);
    else {
        let isEmail = validator.validateEmail(entity);
        let isNumber = validator.validatePhone(entity);
        if(isEmail){
            try {
                let profile = await userModel.findEmail(entity);
                if(profile.length <= 0){
                    res.status(200).send(commonMessage.email_not_valid);
                }else {
                    profile = profile[0];
                    if(profile['Password'] === md5(password)){
                        await userModel.initSession(profile['ID']);
                        let session = await userModel.getSession(profile['ID']);
                        delete profile['Password'];
                        profile['SessionID'] = session;
                        res.status(200).send(profile);
                    }else res.status(200).send(commonMessage.email_not_valid);
                }
            }catch (err){
                res.status(200).send(err);
            }
        }else if(isNumber){
            res.status(200).send("is number");
        }else {
            res.status(200).send("is username");
        }
    }
});

module.exports = router;
