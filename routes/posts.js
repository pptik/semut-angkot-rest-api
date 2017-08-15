const express = require('express');
const router = express.Router();
const commonMsg = require('../configs/common_messages.json');
const userModel = require('../models/user_model');
const postModel = require('../models/post_model');

router.post('/create', async(req, res) => {
    let query = req.body;
    if(
            query['detail'] === undefined ||
            query['session_id'] === undefined ||
            query['tanggal'] === undefined ||
            query['latitude'] === undefined ||
            query['longitude'] === undefined
    ){
        res.status(200).send(commonMsg.body_body_empty);
    }else {
        try{
            let profile = await userModel.checkCompleteSession(query['session_id']);
            if(profile === null) res.status(200).send(commonMsg.session_invalid);
            else {
                query['tanggal'] = new Date(query['tanggal']);
                delete query['session_id'];
                query['PostBy'] = {
                    UserID : profile['UserID'],
                    username : profile['username'],
                    Name : profile['Name']
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



router.post('/get', async(req, res) => {
    let query = req.body;
    if(query['session_id'] === undefined){
        res.status(200).send(commonMsg.body_body_empty);
    }else {
        try{
            let profile = await userModel.checkCompleteSession(query['session_id']);
            if(profile === null) res.status(200).send(commonMsg.session_invalid);
            else {
               let response = await postModel.getPosts();
                res.status(200).send(response);
            }
        }catch (err){
            console.log(err);
            res.status(200).send(commonMsg.service_not_responding);
        }
    }
});

module.exports = router;
