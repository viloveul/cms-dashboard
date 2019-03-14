export default {
  getUser: (state) => () => {
    return state.user
  },
  getMe: (state) => () => {
    return state.me
  },
  getProfile: (state) => () => {
    return state.profile
  },
  getMine: (state) => () => {
    return state.mine
  },
  getUsers: (state) => () => {
    return state.users
  },
  getRoles: (state) => () => {
    return state.roles
  },
  getRole: (state) => () => {
    return state.role
  }
}
