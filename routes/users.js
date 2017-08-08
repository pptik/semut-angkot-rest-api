const express = require('express');
const router = express.Router();
const app = require('../app');


router.get('/', (req, res) => {
    console.log(app.db);
    res.status(200).send("test");
});

module.exports = router;
