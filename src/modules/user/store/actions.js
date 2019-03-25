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
    await context.commit('setMe', {...initial.user})
    await context.commit('setMine', {
      notification: {
        total: 0,
        unread: 0,
        read: 0
      },
      privileges: []
    })
  },
  resetToken: async (context) => {
    await window.localStorage.removeItem('viloveul:token')
    await context.dispatch('resetMe')
  },
  requestToken: async (context, payload) => {
    await context.dispatch('resetToken')
    let { data } = await endpoints.requestToken(payload)
    await window.localStorage.setItem('viloveul:token', data.data.token)
    await context.dispatch('fetchMe')
    return data.data.token
  },
  fetchMe: async (context) => {
    let res = await endpoints.getMe()
    await context.commit('setMe', res.data.data)
    await context.commit('setMine', {
      notification: {...res.data.meta.notification},
      privileges: [...res.data.meta.privileges]
    })
    return res.data.data
  },
  createUser: async (context, payload) => {
    let { data } = await endpoints.createUser(payload)
    return data.data
  },
  deleteUser: async (context, payload) => {
    await endpoints.deleteUser(payload)
  },
  updateUser: async (context, payload) => {
    let { data } = await endpoints.updateUser(payload.id, payload)
    return data.data
  },
  syncRelations: async (context, payload) => {
    let { data } = await endpoints.syncUserRelations(payload.id, payload.relations)
    return data.data
  },
  updateProfile: async (context, payload) => {
    let { data } = await endpoints.updateProfile(payload.id, payload.params)
    return data.data
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
  fetchProfile: async (context, payload) => {
    let { data } = await endpoints.getProfile(payload)
    await context.commit('setProfile', data.data)
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
    return data.data
  },
  updateRole: async (context, payload) => {
    let { data } = await endpoints.updateRole(payload.id, payload)
    return data.data
  },
  assignRoleChilds: async (context, payload) => {
    await endpoints.assignRole(payload.id, {childs: [...payload.childIds]})
  },
  unAssignRoleChilds: async (context, payload) => {
    await endpoints.unAssignRole(payload.id, {childs: [...payload.childIds]})
  }
}

export default actions
