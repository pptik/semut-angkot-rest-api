const express = require('express');
const router = express.Router();
const usrModel = require('../models/user_model');
const commonMsg = require('../configs/common_messages.json');

router.post('/tambah-penumpang', async(req, res) => {
    let session_id = req.body['session_id'];
    let jumlahPenunggu = req.body['jumlah_penunggu'];
    let trayekID = req.body['trayek_id'];
    let flag = req['flag'];
    if(session_id === undefined || jumlahPenunggu === undefined || trayekID === undefined || flag === undefined){
        res.status(200).send(commonMsg.body_body_empty);
    }else {

    }
});




module.exports = router;