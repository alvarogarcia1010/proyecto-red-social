const express = require('express');
const router = express.Router();
const UserManager = require('../Controllers/UserManager');

router.get('/:token', UserManager.reset);

router.post('/:token', UserManager.resetPass);

module.exports = router;
