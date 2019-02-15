import initial from '@/modules/post/store/initial'

const mutations = {
  setPost (state, post) {
    state.post = Object.assign({}, initial.post, post)
  },
  setTag (state, tag) {
    state.tag = Object.assign({}, initial.tag, tag)
  },
  setTags (state, tags) {
    state.tags = tags
  }
}

export default mutations
