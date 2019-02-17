import general from '@/common/general'

const session = {
  getToken () {
    let token = window.localStorage.getItem(general.getTokenKey()) || null
    return token
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
    return general.getTokenHeader() + ' ' + this.getToken()
  }
}

export default session
