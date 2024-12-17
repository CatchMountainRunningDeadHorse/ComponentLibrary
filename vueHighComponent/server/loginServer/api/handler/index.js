const customers = require('../database/customer')

exports.getCustomer = function(req,res){
    const {userId } = req.body

    const customer = customers.find((item)=>{
        return item.id == userId
    })
    // const customer = customers[userId]

    if(!customer){
        return res.json({
            code:1,
            msg:'This customer dosen\'t exist'
        })
    }

    res.json({
        code:0,
        msg:'OK',
        data:customer
    })
}