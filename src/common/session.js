import general from '@/common/general'

const session = {
  getToken () {
    let token = window.localStorage.getItem(general.getTokenKey())
    if ((token === null || token.length === 0) && general.getDefaultToken().length > 0) {
      window.localStorage.setItem(general.getTokenKey(), general.getDefaultToken())
      return general.getDefaultToken()
    } else {
      return token
    }
  },
  async setToken (token) {
    await window.localStorage.setItem(general.getTokenKey(), token)
  },
  hasToken () {
    let token = this.getToken()
    return token !== null && token.length > 0
  },
  async unsetToken () {
    await window.localStorage.clear()
  },
  getAuthHeader () {
    let token = this.getToken()
    return general.getTokenHeader() + ' ' + token
  }
}

export default session
