const getters = {
  isTokenExpired: (state) => {
    // 在这里判断token是否过期，你可以根据你的实际情况来实现这个逻辑。
    // 例如，你可以检查当前时间和token的过期时间是否相差太大。如果过期，返回true，否则返回false。
    if (state.Token == null) return true
    const now = new Date() // 获取当前时间
    const expiryTime = new Date(state.Token.ExpiredTime) // 获取token的过期时间，假设你的token包含一个ExpiredTime字段来记录过期时间
    return now > expiryTime // 如果当前时间大于过期时间，则说明token已过期，返回true，否则返回false。
  },
  accessToken: (state) => state.Token,
  sessionID: (state) => state.SessionID
}
export default getters
