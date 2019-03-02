import initial from '@/modules/feature/store/initial'

export default {
  setWidgetDetail: async (context, detail) => {
    context.widgetDetail = Object.assign({}, initial.widgetDetail, detail)
  },
  setWidgetItems: async (context, items) => {
    context.widgetItems = [...items]
  },
  setWidgetAvailables: async (context, availables) => {
    context.widgetAvailables = [...availables]
  }
}
