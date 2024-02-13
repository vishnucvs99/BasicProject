const express= require('express')
const router = express.Router();

const { addlocation} = require('../Controller/locationcontroller');

router.post("/location",  addlocation);

module.exports = router;