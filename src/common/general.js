const apiUrl = (process.env.VILOVEUL_API_URL !== undefined) ? process.env.VILOVEUL_API_URL : 'http://localhost:19911'

const tokenHeader = (process.env.VILOVEUL_TOKEN_HEADER !== undefined) ? process.env.VILOVEUL_TOKEN_HEADER : 'Bearer'

const defaultToken = (process.env.VILOVEUL_DEFAULT_TOKEN !== undefined) ? process.env.VILOVEUL_DEFAULT_TOKEN : ''

const general = {
  getBaseUrl () {
    return (window.viloveulBaseUrl !== undefined) ? window.viloveulBaseUrl : process.env.BASE_URL
  },
  getApiUrl () {
    return (window.viloveulApiUrl !== undefined) ? window.viloveulApiUrl : apiUrl
  },
  getTokenHeader () {
    return (window.viloveulTokenHeader !== undefined) ? window.viloveulTokenHeader : tokenHeader
  },
  getDefaultToken () {
    return (window.viloveulDefaultToken !== undefined) ? window.viloveulDefaultToken : defaultToken
  }
}

export default general
