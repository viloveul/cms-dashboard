const baseUrl = (typeof process.env.VILOVEUL_BASE_URL !== 'undefined') ? process.env.VILOVEUL_BASE_URL : __dirname

const apiUrl = (typeof process.env.VILOVEUL_API_URL !== 'undefined') ? process.env.VILOVEUL_API_URL : 'http://api.viloveul.com/api/v1'

const tokenHeader = (typeof process.env.VILOVEUL_TOKEN_HEADER !== 'undefined') ? process.env.VILOVEUL_TOKEN_HEADER : 'Bearer'

const defaultToken = (typeof process.env.VILOVEUL_DEFAULT_TOKEN !== 'undefined') ? process.env.VILOVEUL_DEFAULT_TOKEN : ''

const general = {
  getBaseUrl () {
    return (typeof window.viloveulBaseUrl !== 'undefined') ? window.viloveulBaseUrl : baseUrl
  },
  getApiUrl () {
    return (typeof window.viloveulApiUrl !== 'undefined') ? window.viloveulApiUrl : apiUrl
  },
  getTokenHeader () {
    return (typeof window.viloveulTokenHeader !== 'undefined') ? window.viloveulTokenHeader : tokenHeader
  },
  getDefaultToken () {
    return (typeof window.viloveulDefaultToken !== 'undefined') ? window.viloveulDefaultToken : defaultToken
  }
}

export default general
