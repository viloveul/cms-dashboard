import endpoints from '@/common/endpoints'
import initial from '@/modules/menu/store/initial'

export default {
  resetMenu: async (context, payload) => {
    let menu = Object.assign({}, initial.menu, {})
    await context.commit('setMenu', menu)
  },
  fetchMenus: async (context, payload) => {
    let {data} = await endpoints.getMenus(payload)
    return data.data
  },
  fetchMenu: async (context, payload) => {
    let { data } = await endpoints.getMenu(payload)
    await context.commit('setMenu', data.data)
    return data.data
  },
  updateMenu: async (context, payload) => {
    let { data } = await endpoints.updateMenu(payload.id, payload)
    return data.data
  },
  deleteMenu: async (context, payload) => {
    let { data } = await endpoints.deleteMenu(payload)
    return data.data
  },
  createMenu: async (context, payload) => {
    await endpoints.createMenu(payload)
  },
  resetLink: async (context, payload) => {
    let menu = Object.assign({}, initial.menu, {})
    await context.commit('setLink', menu)
  },
  fetchLinks: async (context, payload) => {
    let {data} = await endpoints.getLinks(payload)
    return data.data
  },
  fetchLink: async (context, payload) => {
    let { data } = await endpoints.getLink(payload)
    await context.commit('setLink', data.data)
    return data.data
  },
  updateLink: async (context, payload) => {
    let { data } = await endpoints.updateLink(payload.id, payload)
    return data.data
  },
  deleteLink: async (context, payload) => {
    let { data } = await endpoints.deleteLink(payload)
    return data.data
  },
  createLink: async (context, payload) => {
    await endpoints.createLink(payload)
  }
}
