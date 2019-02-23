const baseUrl = (typeof process.env.VILOVEUL_BASE_URL !== 'undefined') ? process.env.VILOVEUL_BASE_URL : __dirname

const apiUrl = (typeof process.env.VILOVEUL_API_URL !== 'undefined') ? process.env.VILOVEUL_API_URL : 'http://localhost:3333/api/v1'

const tokenKey = (typeof process.env.VILOVEUL_TOKEN_KEY !== 'undefined') ? process.env.VILOVEUL_TOKEN_KEY : 'viloveul'

const tokenHeader = (typeof process.env.VILOVEUL_TOKEN_HEADER !== 'undefined') ? process.env.VILOVEUL_TOKEN_HEADER : 'Bearer'

const defaultToken = (typeof process.env.VILOVEUL_DEFAULT_TOKEN !== 'undefined') ? process.env.VILOVEUL_DEFAULT_TOKEN : ''

const general = {
  getBaseUrl () {
    return (typeof window.viloveulBaseUrl !== 'undefined') ? window.viloveulBaseUrl : baseUrl
  },
  getApiUrl () {
    return (typeof window.viloveulApiUrl !== 'undefined') ? window.viloveulApiUrl : apiUrl
  },
  getTokenKey () {
    return 'token_' + (window.viloveulTokenKey !== undefined ? window.viloveulTokenKey : tokenKey)
  },
  getTokenHeader () {
    return (typeof window.viloveulTokenHeader !== 'undefined') ? window.viloveulTokenHeader : tokenHeader
  },
  getDefaultToken () {
    return (typeof window.viloveulDefaultToken !== 'undefined') ? window.viloveulDefaultToken : defaultToken
  }
}

export default general
