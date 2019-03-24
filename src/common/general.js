const baseUrl = (process.env.VILOVEUL_BASE_URL !== undefined) ? process.env.VILOVEUL_BASE_URL : __dirname

const apiUrl = (process.env.VILOVEUL_API_URL !== undefined) ? process.env.VILOVEUL_API_URL : 'http://localhost:19911'

const relayUrl = (process.env.VILOVEUL_RELAY_URL !== undefined) ? process.env.VILOVEUL_RELAY_URL : 'http://localhost:19910'

const tokenHeader = (process.env.VILOVEUL_TOKEN_HEADER !== undefined) ? process.env.VILOVEUL_TOKEN_HEADER : 'Bearer'

const defaultToken = (process.env.VILOVEUL_DEFAULT_TOKEN !== undefined) ? process.env.VILOVEUL_DEFAULT_TOKEN : ''

const general = {
  getBaseUrl () {
    return (window.viloveulBaseUrl !== undefined) ? window.viloveulBaseUrl : baseUrl
  },
  getApiUrl () {
    return (window.viloveulApiUrl !== undefined) ? window.viloveulApiUrl : apiUrl
  },
  getRelayUrl () {
    return (window.viloveulRelayUrl !== undefined) ? window.viloveulRelayUrl : relayUrl
  },
  getTokenHeader () {
    return (window.viloveulTokenHeader !== undefined) ? window.viloveulTokenHeader : tokenHeader
  },
  getDefaultToken () {
    return (window.viloveulDefaultToken !== undefined) ? window.viloveulDefaultToken : defaultToken
  }
}

export default general
