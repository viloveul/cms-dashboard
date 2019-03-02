export default {
  getWidgetDetail: (context) => () => {
    return context.widgetDetail
  },
  getWidgetAvailables: (context) => () => {
    return context.widgetAvailables
  },
  getWidgetItems: (context) => () => {
    return context.widgetItems
  }
}
