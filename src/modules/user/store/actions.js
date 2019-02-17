import Vue from 'vue'
import initial from '@/modules/user/store/initial'
import session from '@/common/session'
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
  requestToken: async ({ commit }, payload) => {
    await session.unsetToken()
    let {data} = await endpoints.requestToken(payload)
    await session.setToken(data.data.token)
    return data.data.token
  },
  fetchMe: async ({ commit }, payload) => {
    if (session.hasToken()) {
      await endpoints.getMe().then(res => {
        commit('setMe', res.data.data.attributes)
        commit('setPrivileges', res.data.meta.privileges)
      }).catch(async (e) => {
        await session.unsetToken()
        commit('setMe', {...initial.user})
        commit('setPrivileges', [])
      })
    }
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
