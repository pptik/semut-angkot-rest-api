const express = require('express');
const router = express.Router();
const usrModel = require('../models/user_model');
const trayekModel = require('../models/trayek_model');
const commonMsg = require('../configs/common_messages.json');

router.post('/tambah-penumpang', async(req, res) => {
    let session_id = req.body['session_id'];
    let jumlahPenunggu = req.body['jumlah_penunggu'];
    let trayekID = req.body['trayek_id'];
    let flag = req.body['flag'];
    if(session_id === undefined || jumlahPenunggu === undefined || trayekID === undefined || flag === undefined){
        res.status(200).send(commonMsg.body_body_empty);
    }else {
        try {
            let profile = await usrModel.checkSession(session_id);
            if(profile === null) res.status(200).send(commonMsg.session_invalid);
            else {
                await trayekModel.tambahPenumpang(req.body);
                res.status(200).send({success: true, code : '000', message: 'Berhasil menambahkan penunggu'});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(commonMsg.service_not_responding);
        }
    }
});


router.post('/get-penumpang', async(req, res) => {
    let session_id = req.body['session_id'];
    let trayekID = req.body['trayek_id'];
    if(session_id === undefined || trayekID === undefined){
        res.status(200).send(commonMsg.body_body_empty);
    }else {
        try {
            let profile = await usrModel.checkSession(session_id);
            if(profile === null) res.status(200).send(commonMsg.session_invalid);
            else {
                let result = await trayekModel.getPenumpang(req.body);
                res.status(200).send(
                    {
                        success: true,
                        code : '000',
                        message: 'Berhasil menambahkan penunggu',
                        data : result[0]
                    }
                );
            }
        }catch (err){
            console.log(err);
            res.status(200).send(commonMsg.service_not_responding);
        }
    }
});





module.exports = router;