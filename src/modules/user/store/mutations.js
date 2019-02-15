import initial from '@/modules/user/store/initial'

const mutations = {
  setUser: (state, user) => {
    state.user = Object.assign({}, initial.user, user)
  },
  setMe: (state, me) => {
    state.me = Object.assign({}, initial.user, me)
  },
  setPrivileges: (state, privileges) => {
    state.privileges = privileges
  },
  setRole: (state, role) => {
    state.role = Object.assign({}, initial.role, role)
  },
  setRoles: (state, roles) => {
    state.roles = roles
  }
}

export default mutations
