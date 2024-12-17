const express = require('express')
const bodyParser = require('body-parser')
const cors = require('../middleware/cors')
const { ALLOW_ORIGINS } = require('../config')
const router = require('./middleware/router')

const app = express()
app.use(bodyParser.json())
app.use(cors(ALLOW_ORIGINS))
app.use(router(app))
// app.use(router)

app.listen(8100,()=>{
    console.log('API Server is running on PORT 8100');
})