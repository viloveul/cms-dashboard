import initial from '@/modules/widget/store/initial'

export default {
  setDetail: async (context, detail) => {
    context.detail = Object.assign({}, initial.detail, detail)
  },
  setItems: async (context, items) => {
    context.items = [...items]
  },
  setAvailables: async (context, availables) => {
    context.availables = [...availables]
  }
}
