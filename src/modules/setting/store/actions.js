import endpoints from '@/common/endpoints'

export default {
  updateOption: async ({ commit }, payload) => {
    let options = {}
    for (let i in payload) {
      await endpoints.setOption(i, payload[i]).then(async () => {
        options[i] = payload[i]
      })
    }
    await commit('setOption', options)
  },
  fetchOption: async ({ commit }, payload) => {
    let { data } = await endpoints.getOption(payload)
    await commit('setOption', {[payload]: data.data.option})
    return data.data.option
  }
}
