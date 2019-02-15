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
  fetchUser: async (context, payload) => {
    let { data } = await endpoints.getUser(payload)
    context.commit('setUser', data.data)
    return data.data.attributes
  },
  fetchRoles: async (context, payload) => {
    let { data } = await endpoints.getAllRoles(payload)
    context.commit('setRoles', data.data)
    return data.data
  },
  fetchRole: async (context, payload) => {
    let { data } = await endpoints.getRole(payload)
    context.commit('setRole', data.data)
    return data.data.attributes
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
  },
  requestToken: async ({ commit }, payload) => {
    await session.unsetToken()
    await endpoints.requestToken(payload).then(async (res) => {
      await session.setToken(res.data.data.token)
    })
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
  }
}

export default actions
