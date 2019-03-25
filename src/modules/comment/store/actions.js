import endpoints from '@/common/endpoints'
import initial from '@/modules/comment/store/initial'

export default {
  resetComment: async (context) => {
    context.data = Object.assign({}, initial.data)
  },
  fetchComment: async (context, payload) => {
    let { data } = await endpoints.getComment(payload)
    await context.commit('setComment', data.data)
    return data.data
  },
  updateComment: async (context, payload) => {
    await endpoints.updateComment(payload.id, payload)
  }
}
