import Vue from 'vue'
import initial from '@/modules/post/store/initial'
import endpoints from '@/common/endpoints'

export default {
  resetPost: async (context) => {
    for (let i in context.state.post) {
      await Vue.set(context.state.post, i, initial.post[i])
    }
  },
  resetTag: async (context) => {
    for (let i in context.state.tag) {
      await Vue.set(context.state.tag, i, initial.tag[i])
    }
  },
  createPost: async (context, payload) => {
    await endpoints.createPost(payload)
  },
  deletePost: async (context, payload) => {
    await endpoints.deletePost(payload)
  },
  updatePost: async (context, payload) => {
    let { data } = await endpoints.updatePost(payload.id, payload)
    return data.data.attributes
  },
  fetchPost: async (context, payload) => {
    let { data } = await endpoints.getPost(payload)
    context.commit('setPost', data.data)
    return data.data
  },
  fetchTags: async (context, payload) => {
    let { data } = await endpoints.getTags(payload)
    context.commit('setTags', data.data)
    return data.data
  },
  fetchTag: async (context, payload) => {
    let { data } = await endpoints.getTag(payload)
    context.commit('setTag', data.data)
    return data.data
  },
  createTag: async (context, payload) => {
    await endpoints.createTag(payload)
  },
  updateTag: async (context, payload) => {
    await endpoints.updateTag(payload.id, payload)
  },
  deleteTag: async (context, payload) => {
    await endpoints.deleteTag(payload)
  }
}
