export default {
  getUser: (state) => () => {
    return state.user
  },
  getMe: (state) => () => {
    return state.me
  },
  getPrivileges: (state) => () => {
    return state.privileges
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
