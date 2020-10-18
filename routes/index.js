const express = require('express');
const router = express.Router();
const {ifAuthRedirectToDash} = require('../middlewares/auth');

//welcome Page
router.get('/', ifAuthRedirectToDash, (req, res) =>{
    res.render('welcome', { title: 'Express' });
});

module.exports = router;
