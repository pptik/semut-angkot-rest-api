const express = require('express');
const router = express.Router();
const commonMsg = require('../configs/common_messages.json');

router.post('/create', (req, res) => {
    let query = req.body;
    if(
            query['detail'] === undefined ||
            query['session_id'] === undefined ||
            query['tanggal'] === undefined
    ){
        res.status(200).send(commonMsg.body_body_empty);
    }else {
        query['tanggal'] = new Date(query['Date']);
    }
});

module.exports = router;
