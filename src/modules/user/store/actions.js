import Vue from 'vue'
import initial from '@/modules/user/store/initial'
import endpoints from '@/common/endpoints'

const actions = {
  resetUser: async (context) => {
    for (let i in context.state.user) {
      await Vue.set(context.state.user, i, initial.user[i])
    }
  },
  resetRole: async (context) => {
    for (let i in context.state.role) {
      await Vue.set(context.state.role, i, initial.role[i])
    }
  },
  resetMe: async (context) => {
    await context.commit('setMe', {...initial.user.attributes})
    await context.commit('setPrivileges', [])
  },
  resetToken: async (context) => {
    await window.localStorage.removeItem('vtoken')
    await context.dispatch('resetMe')
  },
  requestToken: async (context, payload) => {
    await context.dispatch('resetToken')
    let { data } = await endpoints.requestToken(payload)
    await window.localStorage.setItem('vtoken', data.data.token)
    await context.dispatch('fetchMe')
    return data.data.token
  },
  fetchMe: async (context) => {
    await endpoints.getMe().then(async (res) => {
      await context.commit('setMe', res.data.data.attributes)
      await context.commit('setPrivileges', res.data.meta.privileges)
    }).catch(async (e) => {
      await context.dispatch('resetToken')
    })
  },
  createUser: async (context, payload) => {
    let { data } = await endpoints.createUser(payload)
    return data.data.attributes
  },
  deleteUser: async (context, payload) => {
    await endpoints.deleteUser(payload)
  },
  updateUser: async (context, payload) => {
    let { data } = await endpoints.updateUser(payload.id, payload)
    return data.data.attributes
  },
  fetchUsers: async (context, payload) => {
    let { data } = await endpoints.getUsers(payload.params)
    return data
  },
  fetchUser: async (context, payload) => {
    let { data } = await endpoints.getUser(payload)
    await context.commit('setUser', data.data)
    return data.data
  },
  fetchRoles: async (context, payload) => {
    let { data } = await endpoints.getAllRoles(payload)
    await context.commit('setRoles', data.data)
    return data.data
  },
  fetchRole: async (context, payload) => {
    let { data } = await endpoints.getRole(payload)
    await context.commit('setRole', data.data)
    return context.getters.getRole()
  },
  createRole: async (context, payload) => {
    let { data } = await endpoints.createRole(payload)
    return data.data.attributes
  },
  updateRole: async (context, payload) => {
    let { data } = await endpoints.updateRole(payload.id, payload)
    return data.data.attributes
  },
  assignRoleChilds: async (context, payload) => {
    await endpoints.assignRole(payload.id, {childs: [...payload.childIds]})
  },
  unAssignRoleChilds: async (context, payload) => {
    await endpoints.unAssignRole(payload.id, {childs: [...payload.childIds]})
  }
}

export default actions
