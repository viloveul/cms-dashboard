import endpoints from '@/common/endpoints'
import initial from '@/modules/menu/store/initial'

export default {
  resetMenu: async (context, payload) => {
    let menu = Object.assign({}, initial.menu, {})
    await context.commit('setMenu', menu)
  },
  loadMenus: async (context, payload) => {
    let { data } = await endpoints.loadMenus(payload)
    await context.commit('setMenus', data.data)
  },
  fetchMenus: async (context, payload) => {
    let {data} = await endpoints.getMenus(payload)
    return data.data
  },
  fetchMenu: async (context, payload) => {
    let { data } = await endpoints.getMenu(payload)
    await context.commit('setMenu', data.data.attributes)
    return data.data.attributes
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
  }
}
