import Vue from 'vue'
import initial from '@/modules/media/store/initial'
import endpoints from '@/common/endpoints'

const actions = {
  async resetFile (context) {
    for (let i in context.state) {
      await Vue.set(context.state, i, initial[i])
    }
  },
  async uploadFile (context, payload) {
    await endpoints.uploadFiles(payload)
  },
  async deleteFile (context, payload) {
    await endpoints.deleteFile(payload)
  },
  async fetchFile (context, payload) {
    let { data } = await endpoints.getFile(payload)
    context.commit('setFile', data.data.attributes)
    return data.data.attributes
  }
}

export default actions
