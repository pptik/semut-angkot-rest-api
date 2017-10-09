const express = require('express');
const router = express.Router();
const userModel = require('../models/user_model_v2');
const commonMessage = require('../configs/common_messages.json');
const bodyChecker = require('../utilities/body_checker');


router.post('/login', async(req, res) => {
    let bodyComplete = bodyChecker.check(['Token', 'Strategy', 'id', 'Name', 'Email'], req.body);
    if(bodyComplete) {
        try {
            console.log(req.body);
            let resp = await userModel.loginv2(req.body);
            res.status(200).send(resp);
        } catch (err) {
            console.log(err);
            res.status(200).send(err);
        }
    }else res.status(200).send(commonMessage.body_body_empty);

});





module.exports = router;