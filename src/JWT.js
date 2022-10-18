const { sign, verify } = require('jsonwebtoken');

const createTokens = (user) =>{
    const accessToken = sign({username: user.username, id: user.id}, "23825646")
    return accessToken
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if(!accessToken) return res.status(400).json({error: "User is not authenticated!"});
    console.log("es", accessToken)
    try{
        const validToken = verify(accessToken, "23825646")
        if(validToken){
            req.authenticated = true
            return next();
        }

    }catch(error){
        res.status(400).json({error: error})
    }
}

module.exports = { createTokens, validateToken }