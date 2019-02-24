export default {
  getDetail: (context) => () => {
    return context.detail
  },
  getAvailables: (context) => () => {
    return context.availables
  },
  getItems: (context) => () => {
    return context.items
  }
}
