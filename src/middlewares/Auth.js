const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).json({ "status": "token-unexists" });
    }
    const parts = authHeader.split(' ');
    if(!parts.length === 2){
        res.status(401).json({ "status": "token-error" });
    }
    const [ scheme, token ] = parts;
    if(scheme !== "Bearer"){
        res.status(401).json({ "status": "token-bad-format" });
    }
    jwt.verify(token, process.env.ENC_PASSWORD, async (err, decoded) => {
        if(err){
            res.status(401).json({'status': 'token-bad-sign'});
        }else{
            next();
        }
    });
};