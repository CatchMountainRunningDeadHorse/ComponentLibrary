import axios from 'axios'

function getUserRouters(uid) {
  return axios
    .post('http://localhost:5173/api/postRoutes', { uid })
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      throw err
    })
}

export { getUserRouters }
