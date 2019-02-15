import endpoints from '@/common/endpoints'

const actions = {
  async updateOption ({ commit }, payload) {
    let options = {}
    for (let i in payload) {
      await endpoints.setOption(i, payload[i]).then(async () => {
        options[i] = payload[i]
      })
    }
    await commit('setOption', options)
  },
  async fetchOption ({ commit }, payload) {
    let { data } = await endpoints.getOption(payload)
    commit('setOption', {[payload]: data.data.option})
    return {[payload]: data.data.option}
  }
}

export default actions
