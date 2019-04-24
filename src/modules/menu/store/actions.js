import endpoints from '@/common/endpoints'
import initial from '@/modules/menu/store/initial'

export default {
  resetMenu: async (context, payload) => {
    let menu = Object.assign({}, initial.menu, {})
    await context.commit('setMenu', menu)
  },
  resetMenuItem: async (context, payload) => {
    let menuItem = Object.assign({}, initial.menuItem, {})
    await context.commit('setMenuItem', menuItem)
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
  fetchMenuItem: async (context, payload) => {
    let { data } = await endpoints.getMenuItem(payload)
    await context.commit('setMenuItem', data.data)
    return data.data
  },
  updateMenuItem: async (context, payload) => {
    let { data } = await endpoints.updateMenuItem(payload.id, payload)
    return data.data
  },
  deleteMenuItem: async (context, payload) => {
    let { data } = await endpoints.deleteMenuItem(payload)
    return data.data
  },
  createMenuItem: async (context, payload) => {
    let { data } = await endpoints.createMenuItem(payload)
    return data.data
  }
}
