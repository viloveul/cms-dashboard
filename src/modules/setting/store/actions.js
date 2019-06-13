import endpoints from '@/common/endpoints'

export default {
  updateOption: async ({ commit }, payload) => {
    await endpoints.setOptions(payload)
    await commit('setOptions', {...payload})
  },
  loadOptions: async ({ commit }) => {
    let { data } = await endpoints.getOptions()
    await commit('setOptions', {...data.data})
    return data.data
  }
}
