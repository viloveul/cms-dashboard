import Vue from 'vue'
import initial from '@/modules/post/store/initial'
import endpoints from '@/common/endpoints'

const actions = {
  async resetPost (context) {
    for (let i in context.state.post) {
      await Vue.set(context.state.post, i, initial.post[i])
    }
  },
  async resetTag (context) {
    for (let i in context.state.tag) {
      await Vue.set(context.state.tag, i, initial.tag[i])
    }
  },
  async createPost (context, payload) {
    await endpoints.createPost(payload)
  },
  async deletePost (context, payload) {
    await endpoints.deletePost(payload)
  },
  async updatePost (context, payload) {
    let { data } = await endpoints.updatePost(payload.id, payload)
    return data.data.attributes
  },
  async fetchPost (context, payload) {
    let { data } = await endpoints.getPost(payload)
    context.commit('setPost', data.data)
    return data.data
  },
  async fetchTags (context, payload) {
    let { data } = await endpoints.getAllTags(payload)
    context.commit('setTags', data.data)
    return data.data
  },
  async fetchTag (context, payload) {
    let { data } = await endpoints.getTag(payload)
    context.commit('setTag', data.data)
    return data.data
  },
  async createTag (context, payload) {
    await endpoints.createTag(payload)
  },
  async updateTag (context, payload) {
    await endpoints.updateTag(payload.id, payload)
  }
}

export default actions
