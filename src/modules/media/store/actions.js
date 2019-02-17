import Vue from 'vue'
import initial from '@/modules/media/store/initial'
import endpoints from '@/common/endpoints'

export default {
  resetFile: async (context) => {
    for (let i in context.state) {
      await Vue.set(context.state, i, initial[i])
    }
  },
  uploadFile: async (context, payload) => {
    await endpoints.uploadFiles(payload)
  },
  deleteFile: async (context, payload) => {
    await endpoints.deleteUploadedFile(payload)
  },
  fetchFile: async (context, payload) => {
    let { data } = await endpoints.detailUploadedFile(payload)
    await context.commit('setFile', data.data)
  }
}
