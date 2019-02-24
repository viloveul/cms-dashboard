import endpoints from '@/common/endpoints'
import initial from '@/modules/widget/store/initial'

export default {
  resetItems: async (context) => {
    await context.commit('setItems', initial.items)
  },
  resetDetail: async (context) => {
    await context.commit('setDetail', initial.detail)
  },
  fetchAvailables: async (context, payload) => {
    let res = await endpoints.getWidgetAvailables()
    await context.commit('setAvailables', res.data.data)
  }
}
