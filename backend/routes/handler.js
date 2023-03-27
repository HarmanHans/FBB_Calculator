const express = require('express');
const router = express.Router();

router.get('/calculator', (req, res) => {
    const str = [{
        "name": "First Last",
        "pts": "16.4",
        "ast": "4.1"
    }];
    res.end(JSON.stringify(str));
});

module.exports = router;