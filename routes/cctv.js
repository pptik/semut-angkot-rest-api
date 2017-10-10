const express = require('express');
const router = express.Router();
const userModel = require('../models/user_model_v2');
const cctvModel = require('../models/cctv_model');
const commonMessage = require('../configs/common_messages.json');
const bodyChecker = require('../utilities/body_checker');

router.post('/bandung', async(req, res) =>{
    if(bodyChecker.check(['Token'], req.body)){
        try {
            let status = await userModel.checkToken(req.body['Token']);
            if (status === false) res.status(200).send(commonMessage.session_invalid);
            else {
                let cctv = await cctvModel.getBandungCctv();
                res.status(200).send({
                    success: true,
                    message: "berhasil memuat permintaan",
                    code: "000",
                    data: cctv
                });
            }
        }catch (err) {
            res.status(200).send(commonMessage.service_not_responding);
        }
    }else res.status(200).send(commonMessage.body_body_empty);
});




module.exports = router;