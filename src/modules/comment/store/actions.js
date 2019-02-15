import endpoints from '@/common/endpoints'

const actions = {
  sendComment: async ({ commit }, payload) => {
    await endpoints.sendComment(payload.id, payload.body)
  }
}

export default actions
