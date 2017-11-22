const express = require('express');
const angkotModel = require('../models/angkot_model');
const commonMsg = require('../configs/common_messages.json');
const bodyChecker = require('../utilities/body_checker');
const userModel = require('../models/user_model_v2');


router.post('/angkot', async(req, res) => {
    let query = req.body;
    let bodyComplete = bodyChecker.check(['Token'], req.body);
    if(!bodyComplete){
        res.status(200).send(commonMsg.body_body_empty);
    }else {
        try{
            let profile = await userModel.checkToken(query['Token']);
            if(profile === null) res.status(200).send(commonMsg.session_invalid);
            else {
                let data = await angkotModel.getAngkot();
                let response = {success:true, code: '0000', message: "berhasil memuat data", data:data};
                res.status(200).send(response);
            }
        }catch (err){
            console.log(err);
            res.status(200).send(commonMsg.service_not_responding);
        }
    }
});


module.exports = router;