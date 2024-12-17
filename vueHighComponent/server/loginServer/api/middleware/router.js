const { ACCESS_TOKEN_KEY } = require("../../config")
const { verifyToken } = require("../../middleware/jwt")
const { getCustomer } = require('../handler')


module.exports = function router (app){
    return function(req,res,next){
        app.post('/api/customer',verifyToken(ACCESS_TOKEN_KEY),getCustomer)
        next()
    }
}



// const express = require('express')
// const router = express.Router()
// router.post('/api/customer',verifyToken(ACCESS_TOKEN_KEY),getCustomer)

// //暴露 router
// module.exports = router