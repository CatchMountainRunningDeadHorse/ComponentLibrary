import axios from 'axios'

function getUserRouters(uid){
    return axios.post('/api/postRoutes',{uid}).then(res => {
        return res.data
    }).catch(err => {
        throw err
    })
}

export {
    getUserRouters
}