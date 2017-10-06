const express = require('express');
const router = express.Router();
const userModel = require('../models/user_model_v2');
const commonMessage = require('../configs/common_messages.json');
const validator = require('../utilities/string_validator');
const md5 = require('md5');
const cors = require('cors');


router.post('/login', async(req, res) => {
    try {
        let resp = await userModel.loginv2(req.body);
        res.status(200).send(resp);
    }catch (err){
        console.log(err);
        res.status(200).send(err);
    }
});





module.exports = router;