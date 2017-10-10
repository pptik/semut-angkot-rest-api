const express = require('express');
const router = express.Router();
const commonMsg = require('../configs/common_messages.json');
const userModel = require('../models/user_model_v2');
const postModel = require('../models/post_model');
const bodyChecker = require('../utilities/body_checker');

router.post('/create', async(req, res) => {
    let query = req.body;
    let bodyComplete = bodyChecker.check(['Token', 'detail', 'latitude', 'longitude'], req.body);
    if(!bodyComplete){
        res.status(200).send(commonMsg.body_body_empty);
    }else {
        try{
            let profile = await userModel.checkToken(query['Token']);
            if(profile === null) res.status(200).send(commonMsg.session_invalid);
            else {
                query['tanggal'] = new Date();
                delete query['Token'];
                profile = await userModel.getProfile(profile);
                query['PostBy'] = {
                    UserID : profile['_id'],
                    username : profile['Email'],
                    Name : profile['Profile']['DisplayName']
                };
                query['location'] = {
                    "type": "Point",
                    "coordinates": [parseFloat(query['longitude']), parseFloat(query['latitude'])]

                };
                await postModel.createPost(query);
                let response = {success:true, code: '0000', message: "berhasil membuat laporan"};
                res.status(200).send(response);
            }
        }catch (err){
            console.log(err);
            res.status(200).send(commonMsg.service_not_responding);
        }
    }
});


module.exports = router;
