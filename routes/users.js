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
        try {
            let profile;
            let validMsg;
            if(isEmail){
                profile = await userModel.findEmail(entity);
                validMsg = commonMessage.email_not_valid;
            }else if(isNumber){
                profile = await userModel.findPhoneNumber(entity);
                validMsg = commonMessage.phone_not_valid;
            }else {
                profile = await userModel.findUserName(entity);
                validMsg = commonMessage.username_not_valid;
            }

            if(profile.length <= 0){
                res.status(200).send(validMsg);
            }else {
                profile = profile[0];
                if(profile['Password'] === md5(password)){
                    await userModel.initSession(profile['ID']);
                    let session = await userModel.getSession(profile['ID']);
                    delete profile['Password'];
                    profile['SessionID'] = session;
                    res.status(200).send(profile);
                }else res.status(200).send(validMsg);
            }
        }catch (err){
            console.log(err);
            res.status(200).send(commonMessage.service_not_responding);
        }
    }
});

module.exports = router;
