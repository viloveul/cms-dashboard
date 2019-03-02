import endpoints from '@/common/endpoints'
import initial from '@/modules/feature/store/initial'

export default {
  resetWidgetItems: async (context) => {
    await context.commit('setWidgetItems', initial.widgetItems)
  },
  resetWidgetDetail: async (context) => {
    await context.commit('setWidgetDetail', initial.widgetDetail)
  },
  fetchWidgetAvailables: async (context, payload) => {
    let res = await endpoints.getWidgetAvailables()
    await context.commit('setWidgetAvailables', res.data.data)
  }
}
